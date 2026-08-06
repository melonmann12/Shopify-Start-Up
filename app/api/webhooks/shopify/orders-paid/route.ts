import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
// Webhooks can sometimes take a while or be large, but default config is fine.

function hashData(data: string | undefined | null): string | undefined {
  if (!data) return undefined;
  // Meta normalization: trim and lowercase
  const normalized = data.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function normalizeAndHashPhone(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  // Remove all non-numeric characters for phone
  const normalized = phone.replace(/\D/g, '');
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

// Ensure constant time comparison works by padding if lengths differ
// (timingSafeEqual requires equal length buffers)
function secureCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  try {
    // 3. Read the request body exactly once as raw text
    const rawBody = await req.text();

    // 4. Verify HMAC
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;

    if (!hmacHeader || !webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized: Missing signature or secret' }, { status: 401 });
    }

    const generatedHash = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody, 'utf8')
      .digest('base64');

    if (!secureCompare(generatedHash, hmacHeader)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
    }

    // 5. Validate Shopify Headers
    const topic = req.headers.get('x-shopify-topic');
    const shopDomain = req.headers.get('x-shopify-shop-domain');
    const webhookId = req.headers.get('x-shopify-webhook-id');
    const expectedDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

    if (topic !== 'orders/paid') {
      return NextResponse.json({ message: 'Ignored: Topic not orders/paid' }, { status: 200 });
    }

    if (expectedDomain && shopDomain !== expectedDomain) {
      return NextResponse.json({ error: 'Unauthorized: Invalid shop domain' }, { status: 401 });
    }

    // 12. Idempotency handling
    // TODO: Implement durable webhook-delivery storage (e.g., Redis, Postgres) to track processed `webhookId`s.
    // In-memory storage is NOT production-safe for idempotency on Vercel serverless environments.
    // We rely on Meta's deduplication via the deterministic event_id for now.
    if (!webhookId) {
       console.warn('Webhook received without x-shopify-webhook-id');
    }

    // Parse the validated payload
    let order: any;
    try {
      order = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }

    // Check Meta config
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    const graphApiVersion = process.env.META_GRAPH_API_VERSION || 'v25.0';

    if (!pixelId || !accessToken) {
      // Configuration error, but we still return 200 to Shopify so it doesn't retry endlessly
      console.error('Meta CAPI configuration is missing.');
      return NextResponse.json({ message: 'Webhook received, but CAPI not configured.' }, { status: 200 });
    }

    // 7. Deterministic event_id
    const eventId = `shopify_purchase_${shopDomain || 'unknown'}_${order.id}`;

    // 8. Build Meta Purchase event payload
    const eventTime = Math.floor(
      new Date(order.processed_at || order.updated_at || Date.now()).getTime() / 1000
    );

    const eventSourceUrl = 
      order.landing_site || 
      order.referring_site || 
      (expectedDomain ? `https://${expectedDomain}` : 'https://unknown');

    const contentIds: string[] = [];
    const contents: any[] = [];
    let numItems = 0;

    if (Array.isArray(order.line_items)) {
      for (const item of order.line_items) {
        const id = (item.variant_id || item.product_id || item.id).toString();
        contentIds.push(id);
        contents.push({
          id,
          quantity: item.quantity,
          item_price: parseFloat(item.price || '0')
        });
        numItems += (item.quantity || 1);
      }
    }

    const value = parseFloat(order.total_price || '0');
    const currency = order.currency || order.presentment_currency || 'USD';

    // 9 & 10. Build Meta user_data with hashing
    const billing = order.billing_address || {};
    const customer = order.customer || {};

    const email = hashData(order.email || customer.email);
    const phone = normalizeAndHashPhone(billing.phone || customer.phone || order.phone);
    const fn = hashData(billing.first_name || customer.first_name);
    const ln = hashData(billing.last_name || customer.last_name);
    const city = hashData(billing.city);
    const state = hashData(billing.province_code || billing.province);
    const zp = hashData(billing.zip);
    const country = hashData(billing.country_code || billing.country);
    
    // External ID from Customer ID
    const externalId = customer.id ? hashData(customer.id.toString()) : undefined;

    // These don't need hashing
    const clientIpAddress = order.browser_ip;
    const clientUserAgent = order.client_details?.user_agent;

    // FBP / FBC could optionally be extracted from order.note_attributes if the frontend sends them,
    // but without assuming the format, we'll try a common convention:
    let fbp, fbc;
    if (Array.isArray(order.note_attributes)) {
      for (const attr of order.note_attributes) {
        if (attr.name === '_fbp') fbp = attr.value;
        if (attr.name === '_fbc') fbc = attr.value;
      }
    }

    const userData: any = {
      client_ip_address: clientIpAddress,
      client_user_agent: clientUserAgent,
      fbp,
      fbc,
      external_id: externalId,
    };

    // Only add hashed fields if they exist
    if (email) userData.em = [email];
    if (phone) userData.ph = [phone];
    if (fn) userData.fn = [fn];
    if (ln) userData.ln = [ln];
    if (city) userData.ct = [city];
    if (state) userData.st = [state];
    if (zp) userData.zp = [zp];
    if (country) userData.country = [country];

    const payload: any = {
      data: [
        {
          event_name: 'Purchase',
          event_time: eventTime,
          event_id: eventId,
          action_source: 'website',
          event_source_url: eventSourceUrl,
          user_data: userData,
          custom_data: {
            currency,
            value,
            order_id: (order.order_number || order.id).toString(),
            content_type: 'product',
            content_ids: contentIds,
            contents,
            num_items: numItems
          }
        }
      ],
      access_token: accessToken
    };

    // 11. Support META_TEST_EVENT_CODE only if enabled
    if (process.env.META_ENABLE_SHOPIFY_PURCHASE_TEST_EVENTS === 'true') {
      const testCode = process.env.META_TEST_EVENT_CODE;
      if (testCode) {
        payload.test_event_code = testCode;
      }
    }

    const metaEndpoint = `https://graph.facebook.com/${graphApiVersion}/${pixelId}/events`;

    const metaRes = await fetch(metaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    const metaResult = await metaRes.json();

    if (!metaRes.ok) {
      // 13. Sanitize errors
      console.error('Meta CAPI Error:', metaResult?.error?.message);
      return NextResponse.json(
        { error: 'Failed to deliver to Meta' },
        { status: 502 }
      );
    }

    // 13. Return HTTP 200 quickly after successful processing
    return NextResponse.json({ success: true, event_id: eventId }, { status: 200 });

  } catch (error) {
    // Return sanitized errors without exposing anything
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
