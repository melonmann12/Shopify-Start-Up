'use client'

import { ShopifyProvider } from '@shopify/hydrogen-react'

export function ShopifyAnalyticsProvider({ children, domain }: { children: React.ReactNode, domain: string }) {
  // We must route useShopifyCookies tracking requests to our local same-origin proxy
  // so that HttpOnly tracking cookies can be set on the first-party domain.
  const proxyDomain = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, '')
    : (typeof window !== 'undefined' ? window.location.host : domain);
    
  const scheme = process.env.NODE_ENV === 'development' ? 'http://' : 'https://';

  return (
    <ShopifyProvider
      storeDomain={`${scheme}${proxyDomain}`}
      storefrontToken="proxy" // Dummy token; requests hit our same-origin proxy which attaches the real token securely
      storefrontApiVersion="2026-04"
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      {children}
    </ShopifyProvider>
  )
}
