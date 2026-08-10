import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return NextResponse.json({ error: 'Missing Shopify configuration' }, { status: 500 });
  }

  const body = await req.text();
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('X-Shopify-Storefront-Access-Token', token);
  
  // Forward tracking cookies/headers from hydrogen-react
  const visitToken = req.headers.get('shopify-visit-token');
  const uniqueToken = req.headers.get('shopify-unique-token');
  
  if (visitToken) headers.set('shopify-visit-token', visitToken);
  if (uniqueToken) headers.set('shopify-unique-token', uniqueToken);

  try {
    const response = await fetch(`https://${domain}/api/2026-04/graphql.json`, {
      method: 'POST',
      headers,
      body,
    });

    const data = await response.text();
    const res = new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
    });

    // Pass through relevant Shopify tracking headers required by useShopifyCookies
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.headers.set('set-cookie', setCookie);
    }
    const serverTiming = response.headers.get('server-timing');
    if (serverTiming) {
      res.headers.set('server-timing', serverTiming);
    }

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from Shopify' }, { status: 500 });
  }
}
