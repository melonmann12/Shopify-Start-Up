import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, rating, name, email, title, body: reviewBody, pictureUrls } = body

    // Validation
    if (!productId || !rating || !name || !email || !reviewBody) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
    }

    // Convert productId to numeric external Shopify ID
    // Example: gid://shopify/Product/123456789 -> 123456789
    const numericId = productId.includes('gid://') 
      ? productId.split('/').pop() 
      : productId

    if (!numericId) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const shopDomain = process.env.JUDGEME_SHOP_DOMAIN

    if (!shopDomain) {
      console.error('[Judge.me API] Missing JUDGEME_SHOP_DOMAIN in environment')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // POST to Judge.me (Public endpoint, no api_token needed)
    const judgeMeUrl = 'https://api.judge.me/api/v1/reviews'
    const payload = {
      shop_domain: shopDomain,
      platform: 'shopify',
      id: numericId, // External Shopify Product ID
      email: email.trim(),
      name: name.trim(),
      rating: rating,
      title: title?.trim() || '',
      body: reviewBody.trim(),
      ...(pictureUrls && Array.isArray(pictureUrls) && pictureUrls.length > 0 && {
        picture_urls: pictureUrls.filter(url => 
          typeof url === 'string' && url.startsWith('https://res.cloudinary.com/')
        )
      })
    }

    const response = await fetch(judgeMeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const responseBody = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.error('[Judge.me API] Failed to submit review:', response.status, responseBody)
      return NextResponse.json(
        { error: 'Failed to submit review to Judge.me', details: responseBody }, 
        { status: response.status }
      )
    }

    // Additional check in case Judge.me returns 200 but includes an error object or fails to create
    if (responseBody.error || (responseBody.message && responseBody.message.toLowerCase().includes('error'))) {
      console.error('[Judge.me API] Judge.me reported success but returned an error:', responseBody)
      return NextResponse.json(
        { error: responseBody.error || responseBody.message || 'Failed to submit review' }, 
        { status: 400 }
      )
    }

    // Success response should include the created review object or success message
    return NextResponse.json({ success: true, data: responseBody })

  } catch (error) {
    console.error('[Judge.me API] Error submitting review:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
