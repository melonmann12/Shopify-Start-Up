'use client'

import { usePathname, useParams } from 'next/navigation'
import React from 'react'

export default function AnnouncementBar() {
  const pathname = usePathname()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const targetHomePath = `/${locale}`

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === targetHomePath || pathname === '/') {
      e.preventDefault()
      const element = document.getElementById('newsletter')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="bg-black py-2.5 text-center text-white text-label">
      Free Delivery & Returns — Members Get Free Shipping On Every Order.{' '}
      <a 
        href={`/${locale}#newsletter`} 
        onClick={handleClick}
        className="underline underline-offset-4 font-bold hover:text-white/80 transition-colors"
      >
        Join Now
      </a>
    </div>
  )
}
