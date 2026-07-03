import { Suspense } from 'react'
import type { Metadata } from 'next'
import ThankYouClient from '@/components/checkout/ThankYouClient'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Thank you for your purchase. We are processing your order credentials.',
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ThankYouPage(props: Props) {
  const params = await props.params
  const { locale } = params

  return (
    <Suspense 
      fallback={
        <div className="flex-grow flex items-center justify-center min-h-[60vh]">
           <span className="material-symbols-outlined animate-spin text-4xl text-primary font-light">refresh</span>
        </div>
      }
    >
      <ThankYouClient locale={locale} />
    </Suspense>
  )
}
