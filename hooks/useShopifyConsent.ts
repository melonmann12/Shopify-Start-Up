'use client'

import { useEffect, useState } from 'react'

export function useShopifyConsent() {
  const [hasUserConsent, setHasUserConsent] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkConsent = () => {
      const privacy = (window as any).Shopify?.customerPrivacy
      if (privacy && typeof privacy.analyticsProcessingAllowed === 'function') {
        setHasUserConsent(privacy.analyticsProcessingAllowed())
      } else {
        setHasUserConsent(false)
      }
    }

    // If API isn't available yet, inject the script
    if (!(window as any).Shopify?.customerPrivacy) {
      if (!document.querySelector('script[data-shopify-privacy]')) {
        const script = document.createElement('script')
        script.setAttribute('data-shopify-privacy', 'true')
        script.src = 'https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js'
        script.async = true
        script.onload = checkConsent
        document.head.appendChild(script)
      }
    } else {
      checkConsent()
    }

    // Listen to changes in consent (e.g., when the user interacts with the banner)
    window.addEventListener('visitorConsentCollected', checkConsent)
    return () => window.removeEventListener('visitorConsentCollected', checkConsent)
  }, [])

  return hasUserConsent
}
