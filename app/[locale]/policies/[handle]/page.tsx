import { notFound } from 'next/navigation'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_SHOP_POLICIES } from '@/lib/shopify/queries/policy'
import type { ShopifyPoliciesResponse } from '@/lib/shopify/types'
import Link from 'next/link'

interface Props {
  params: Promise<{ locale: string; handle: string }>
}

const HANDLE_MAP: Record<string, keyof ShopifyPoliciesResponse['shop']> = {
  'shipping-policy': 'shippingPolicy',
  'privacy-policy': 'privacyPolicy',
  'refund-policy': 'refundPolicy',
  'terms-of-service': 'termsOfService',
}

export default async function PolicyPage(props: Props) {
  const params = await props.params
  const { handle, locale } = params

  const queryKey = HANDLE_MAP[handle]
  
  // If the user requested a url completely outside Shopify's known policy handles, kill immediately.
  if (!queryKey) {
    notFound()
  }

  const data = await shopifyFetch<ShopifyPoliciesResponse>(
    GET_SHOP_POLICIES,
    {}
  )

  const policy = data?.shop?.[queryKey]

  // If Shopify evaluated correctly but the store owner deleted or hasn't provided the policy
  if (!policy) {
    notFound()
  }

  return (
    <main className="min-h-screen py-20 md:py-32 px-6 sm:px-12 md:px-24 bg-surface max-w-screen-2xl mx-auto">
      <div className="max-w-[800px] mx-auto">
        <Link href={`/${locale}`} className="inline-flex items-center text-sm font-label uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-12">
          <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: '18px' }}>arrow_back</span>
          Back to Home
        </Link>
        <header className="mb-20">
          <p className="font-label text-sm uppercase tracking-[0.05em] text-on-surface-variant mb-6">
            CURRENT PROVISIONS IN EFFECT
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary leading-none uppercase">
            {policy.title}
          </h1>
        </header>

        <div 
          className="space-y-8 text-on-surface font-body text-base leading-relaxed 
                     [&_h2]:font-headline [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-16 [&_h2]:mb-6
                     [&_h3]:font-headline [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-primary [&_h3]:mt-8 [&_h3]:mb-4
                     [&_p]:mb-6 [&_p]:text-on-surface
                     [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ul]:space-y-3 [&_ul]:text-on-surface-variant
                     [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6 [&_ol]:space-y-3 [&_ol]:text-on-surface-variant
                     [&_li]:pl-2
                     [&_a]:font-bold [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a]:hover:text-surface-tint [&_a]:transition-colors"
          dangerouslySetInnerHTML={{ __html: policy.body }} 
        />
        
        <div className="pt-24 mt-24 border-t border-outline-variant/30 text-center">
            <p className="font-headline text-lg text-primary">
                Questions? Contact our support team at <Link className="font-bold underline decoration-1 underline-offset-4 hover:text-surface-tint transition-colors duration-200" href={`/${locale}/contact`}>Contact Page</Link>
            </p>
        </div>
      </div>
    </main>
  )
}
