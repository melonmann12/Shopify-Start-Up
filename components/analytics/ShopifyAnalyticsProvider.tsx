'use client'

import { ShopifyProvider } from '@shopify/hydrogen-react'

export function ShopifyAnalyticsProvider({ children, domain }: { children: React.ReactNode, domain: string }) {
  return (
    <ShopifyProvider
      storeDomain={domain}
      storefrontToken="proxy" // Dummy token; requests hit our same-origin proxy which attaches the real token securely
      storefrontApiVersion="2026-04"
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      {children}
    </ShopifyProvider>
  )
}
