'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const UI_TEXT = {
  orderConfirmed: "ORDER CONFIRMED.",
  thankYouWithOrder: "Thank you for shopping with us. Your order is being prepared with care.",
  orderNumberPrefix: "Order Number: #",
  summarySentTo: "We've sent a summary to ",
  thankYouProcessing: "Thank you for your purchase! We are currently processing your order credentials.",
  continueExploring: "CONTINUE EXPLORING",
  needHelp: "Need help with your order?",
}

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
          className="material-symbols-outlined text-[4rem] text-on-background"
          style={{ fontVariationSettings: "'wght' 200, 'FILL' 1" }}
        >
          check_circle
        </span>
      </div>

      {/* Primary Heading */}
      <h1 className="font-serif text-[2.75rem] leading-tight font-normal text-on-background mb-6">
        {UI_TEXT.orderConfirmed}
      </h1>

      {/* Appreciation & Dynamic Info */}
      <div className="space-y-4 mb-16 max-w-lg mx-auto w-full">
        {orderId ? (
          <>
            <p className="font-sans font-light text-sm text-on-surface-variant leading-[1.6]">
              {UI_TEXT.thankYouWithOrder}
            </p>
            <div className="bg-surface-container-low py-6 px-8 rounded-lg mt-6 border border-outline/20">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-background mb-2">
                {UI_TEXT.orderNumberPrefix}{orderId}
              </p>
              {email && (
                <p className="font-sans font-light text-sm text-on-surface-variant leading-[1.6]">
                  {UI_TEXT.summarySentTo}<span className="font-medium text-on-background">{email}</span>.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-surface-container-low py-6 px-8 rounded-lg mt-6 border border-outline/20">
            <p className="font-sans font-light text-sm text-on-surface-variant leading-[1.6]">
              {UI_TEXT.thankYouProcessing}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center space-y-6 w-full max-w-sm mx-auto">
        <Link
          href={`/${locale}/collections`}
          className="w-full inline-flex justify-center items-center px-8 py-5 border border-on-background bg-on-background text-surface-container-lowest font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-transparent hover:text-on-background"
        >
          {UI_TEXT.continueExploring}
        </Link>

        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center space-x-2 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-background transition-colors duration-200 group"
        >
          <span>{UI_TEXT.needHelp}</span>
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
        </Link>
      </div>

    </div>
  )
}
