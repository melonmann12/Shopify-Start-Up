// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-shopify-topic')
  const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET

  if (!webhookSecret || req.headers.get('x-shopify-webhook-id') === null) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // Revalidate all product and collection pages
  revalidatePath('/[locale]/products', 'page')
  revalidatePath('/[locale]/collections', 'page')

  return NextResponse.json({ revalidated: true, topic: secret })
}
