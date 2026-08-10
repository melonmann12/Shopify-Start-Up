'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useShopifyCookies, sendShopifyAnalytics, getClientBrowserParameters, AnalyticsEventName } from '@shopify/hydrogen-react'
import type { ShopifyPageViewPayload } from '@shopify/hydrogen-react'
import { useShopifyConsent } from '@/hooks/useShopifyConsent'

export function ShopifyAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTrackedUrl = useRef<string | null>(null)
  const hasUserConsent = useShopifyConsent()



  // This will make a request to /api/2026-04/graphql.json to fetch tracking values
  useShopifyCookies({ fetchTrackingValues: true, hasUserConsent })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    // Deduplicate PAGE_VIEW events
    if (lastTrackedUrl.current === url) return
    lastTrackedUrl.current = url

    const payload: ShopifyPageViewPayload = {
      ...getClientBrowserParameters(),
      hasUserConsent,
      shopifySalesChannel: 'headless',
      shopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID || '',
      currency: 'USD',
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Shopify Analytics] PAGE_VIEW', payload)
    }

    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload
    }).catch(() => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Shopify Analytics] PAGE_VIEW delivery blocked or failed')
      }
    })
  }, [pathname, searchParams, hasUserConsent])

  return null
}
