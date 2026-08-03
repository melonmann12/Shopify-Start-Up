'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { PIXEL_ID, pageview } from '@/lib/analytics/metaPixel'

export default function MetaPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTrackedUrl = useRef<string | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Meta Pixel] MetaPixel component mounted or route changed.')
    }
    if (typeof window !== 'undefined') {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      
      if (lastTrackedUrl.current === url) return
      
      lastTrackedUrl.current = url
      pageview()
    }
  }, [pathname, searchParams])

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt="Meta Pixel"
      />
    </noscript>
  )
}
