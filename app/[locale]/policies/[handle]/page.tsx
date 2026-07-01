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
        <Link href={`/${locale}`} className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-background transition-colors mb-12">
          <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: '18px' }}>arrow_back</span>
          Back to Home
        </Link>
        <header className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-6">
            CURRENT PROVISIONS IN EFFECT
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal tracking-normal text-on-background leading-tight">
            {policy.title}
          </h1>
        </header>

        <div 
          className="space-y-8 text-on-surface-variant font-sans font-light text-sm leading-[1.6] 
                     [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-normal [&_h2]:text-on-background [&_h2]:mt-16 [&_h2]:mb-6
                     [&_h3]:font-mono [&_h3]:text-[10px] [&_h3]:tracking-[0.2em] [&_h3]:uppercase [&_h3]:text-on-background [&_h3]:mt-8 [&_h3]:mb-4
                     [&_p]:mb-6 [&_p]:text-on-surface-variant
                     [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ul]:space-y-3 [&_ul]:text-on-surface-variant
                     [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6 [&_ol]:space-y-3 [&_ol]:text-on-surface-variant
                     [&_li]:pl-2
                     [&_a]:font-normal [&_a]:underline [&_a]:decoration-outline/30 [&_a]:underline-offset-4 [&_a]:hover:decoration-on-background [&_a]:text-on-background [&_a]:transition-colors"
          dangerouslySetInnerHTML={{ __html: policy.body }} 
        />
        
        <div className="pt-24 mt-24 border-t border-outline/20 text-center">
            <p className="font-serif text-xl text-on-background">
                Questions? Contact our support team at <Link className="font-normal italic underline decoration-outline/30 underline-offset-4 hover:decoration-on-background transition-colors duration-200" href={`/${locale}/contact`}>Contact Page</Link>
            </p>
        </div>
      </div>
    </main>
  )
}
