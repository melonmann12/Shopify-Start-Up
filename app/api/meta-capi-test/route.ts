import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify endpoint protection secret
    const secret = process.env.META_CAPI_TEST_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: 'Endpoint is disabled or misconfigured' },
        { status: 503 }
      );
    }

    const authHeader = request.headers.get('x-capi-test-secret');
    if (authHeader !== secret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Validate required environment variables
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 3. Extract event parameters
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    // Trusted proxy headers (Vercel uses x-forwarded-for)
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0';
    
    // Safely parse IP in case of multiple IPs in x-forwarded-for
    const firstClientIp = clientIp.split(',')[0].trim();

    // Event source URL
    const eventSourceUrl = request.headers.get('referer') || request.url;

    // 4. Construct payload
    const eventTime = Math.floor(Date.now() / 1000);
    const eventId = crypto.randomUUID();

    const payload: Record<string, any> = {
      data: [
        {
          event_name: 'PageView',
          event_time: eventTime,
          event_id: eventId,
          action_source: 'website',
          event_source_url: eventSourceUrl,
          user_data: {
            client_user_agent: userAgent,
            client_ip_address: firstClientIp,
          },
        },
      ],
      access_token: accessToken,
    };

    const testEventCode = process.env.META_TEST_EVENT_CODE;
    if (testEventCode) {
      payload.test_event_code = testEventCode;
    }

    // 5. Send event to Meta Conversions API
    const graphApiVersion = process.env.META_GRAPH_API_VERSION || 'v25.0';
    
    if (!/^v\d+\.\d+$/.test(graphApiVersion)) {
      return NextResponse.json(
        { error: 'Invalid Server Configuration: Graph API version format is incorrect.' },
        { status: 500 }
      );
    }

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
      return NextResponse.json(
        { 
          error: 'Meta API Error', 
          details: {
            message: result?.error?.message || 'Unknown Meta error',
            type: result?.error?.type || 'Unknown',
            code: result?.error?.code || 'Unknown'
          }
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Test event sent successfully',
        events_received: result.events_received 
      },
      { status: 200 }
    );
  } catch (error) {
    // Sanitize general errors
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
