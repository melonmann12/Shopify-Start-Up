import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Validate required environment variables
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      console.error('Meta CAPI configuration is missing.');
      // Return 200 so we don't break the client, it's best-effort analytics
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 200 });
    }

    // 2. Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { event_id, variantId, price, currency, productTitle, event_source_url } = body;

    if (!event_id || !variantId || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Extract user data (Headers and Cookies)
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    // Trusted proxy headers (Vercel uses x-forwarded-for)
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    let firstClientIp;
    if (clientIp) {
      firstClientIp = clientIp.split(',')[0].trim();
    }

    const cookieStore = await cookies();
    const fbp = cookieStore.get('_fbp')?.value;
    const fbc = cookieStore.get('_fbc')?.value;

    const userData: any = {
      client_user_agent: userAgent,
    };

    if (firstClientIp) {
      userData.client_ip_address = firstClientIp;
    }
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    // 4. Construct content_ids matching the browser Pixel logic
    // Format Meta Content ID (extract numeric part from GID)
    const metaId = variantId.split('/').pop() || variantId;

    // 5. Construct payload
    const eventTime = Math.floor(Date.now() / 1000);

    const payload: Record<string, any> = {
      data: [
        {
          event_name: 'AddToCart',
          event_time: eventTime,
          event_id: event_id,
          action_source: 'website',
          event_source_url: event_source_url || request.headers.get('referer') || request.url,
          user_data: userData,
          custom_data: {
            content_ids: [metaId],
            content_type: 'product',
            content_name: productTitle,
            value: Number(price),
            currency: currency || 'USD',
            contents: [{ id: metaId, quantity: 1 }],
          },
        },
      ],
      access_token: accessToken,
    };

    const testEventEnabled = process.env.META_ENABLE_ATC_TEST_EVENTS === 'true';
    if (testEventEnabled) {
      const testEventCode = process.env.META_TEST_EVENT_CODE;
      if (testEventCode) {
        payload.test_event_code = testEventCode;
      }
    }

    // 6. Send event to Meta Conversions API
    const graphApiVersion = process.env.META_GRAPH_API_VERSION || 'v25.0';
    const metaEndpoint = `https://graph.facebook.com/${graphApiVersion}/${pixelId}/events`;

    const response = await fetch(metaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      // Sanitize Meta's error response (never expose tokens or full URLs)
      console.error('Meta API Error:', result?.error?.message || 'Unknown Meta error');
      // Return 200 so we don't block the client cart action
      return NextResponse.json(
        { success: false, message: 'Failed to deliver to Meta' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        event_id: event_id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Internal Error in Meta CAPI AddToCart:', error);
    // Sanitize general errors, return 200 to not break client
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 200 }
    );
  }
}
