'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

export default function AnnouncementBar() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  return (
    <div className="bg-black py-2.5 text-center text-white text-label px-4">
      BACK TO SCHOOL — BUY 2 GET 1 FREE + 15% OFF{' '}
      <Link 
        href={`/${locale}/collections/back-to-school`} 
        className="underline underline-offset-4 font-bold hover:text-white/80 transition-colors ml-1"
      >
        SHOP NOW
      </Link>
    </div>
  )
}
