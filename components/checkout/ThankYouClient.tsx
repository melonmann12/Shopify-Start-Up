'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  locale: string
}

export default function ThankYouClient({ locale }: Props) {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const email = searchParams.get('email')
  
  // Quick state to ensure fade-in animation triggers purely on client mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className={`flex-grow flex flex-col items-center justify-center px-6 py-24 sm:py-32 lg:py-40 max-w-3xl mx-auto w-full text-center transition-opacity duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      
      {/* Subtle Visual Cue */}
      <div className="mb-12 flex justify-center">
        <span 
          className="material-symbols-outlined text-[4rem] text-primary" 
          style={{ fontVariationSettings: "'wght' 200, 'FILL' 1" }}
        >
          check_circle
        </span>
      </div>

      {/* Primary Heading */}
      <h1 className="font-display text-[2.75rem] leading-tight font-extrabold tracking-[-0.02em] text-primary mb-6">
        ORDER CONFIRMED.
      </h1>

      {/* Appreciation & Dynamic Info */}
      <div className="space-y-4 mb-16 max-w-lg mx-auto w-full">
        {orderId ? (
          <>
            <p className="font-body text-base text-on-surface-variant leading-[1.6]">
              Thank you for shopping with us. Your order is being prepared with care.
            </p>
            <div className="bg-surface-container-low py-6 px-8 rounded-lg mt-6">
              <p className="font-label text-sm uppercase tracking-[0.05em] text-primary font-bold mb-2">
                Order Number: #{orderId}
              </p>
              {email && (
                <p className="font-body text-sm text-on-surface-variant leading-[1.6]">
                  We&apos;ve sent a summary to <span className="font-medium text-primary">{email}</span>.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-surface-container-low py-6 px-8 rounded-lg mt-6">
            <p className="font-body text-base text-on-surface-variant leading-[1.6]">
              Thank you for your purchase! We are currently processing your order credentials.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center space-y-6 w-full max-w-sm mx-auto">
        <Link 
          href={`/${locale}/collections/all`}
          className="w-full inline-flex justify-center items-center px-8 py-4 bg-primary text-on-primary rounded-full font-label text-sm uppercase tracking-[0.05em] font-semibold transition-colors duration-300 hover:bg-primary-fixed hover:text-on-primary-fixed"
        >
          CONTINUE EXPLORING
        </Link>
        
        <Link 
          href={`/${locale}/contact`}
          className="inline-flex items-center space-x-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors duration-200 group"
        >
          <span>Need help with your order?</span>
          <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
        </Link>
      </div>

    </div>
  )
}
