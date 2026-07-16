// app/[locale]/track-order/page.tsx
// Order tracking backend is not yet implemented.
// This page directs customers to contact support with their order number.
// Update this page when a real tracking integration is available.
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Track your Nailestial order status. Contact our support team with your order number for the latest updates.',
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function TrackOrderPage({ params }: Props) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="px-6 md:px-16 pt-16 pb-10 max-w-3xl mx-auto text-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-on-surface-variant mb-4">
          Customer Care
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-on-background leading-tight mb-6">
          Track Your Order
        </h1>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-lg mx-auto">
          Our self-serve order tracking portal is coming soon. In the meantime, our team is happy to provide a shipping update for you directly.
        </p>
      </section>

      {/* Steps */}
      <section className="px-6 md:px-16 pb-16 max-w-xl mx-auto">
        <div className="border border-outline/15 bg-surface-container-lowest p-8 space-y-6">
          <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
            How to Get Your Order Update
          </h2>
          <ol className="space-y-5">
            {[
              'Find your order confirmation email — it contains your order number (e.g. #1001).',
              "Contact our support team via the form below or at support@nailestial.com.",
              'Include your order number and the email address used at checkout.',
              'We will reply within 1–2 business days with your latest shipping status.',
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 font-serif text-xl text-on-surface-variant/30 leading-tight">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <div className="pt-2">
            <Link
              href={`/${locale}/contact`}
              className="inline-block font-sans text-xs font-medium text-on-background border border-on-background/30 hover:border-on-background px-8 py-3 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Shipping note */}
      <section className="px-6 md:px-16 pb-24 max-w-xl mx-auto">
        <div className="border-t border-outline/10 pt-8 space-y-4">
          <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
            Shipping Timeframes
          </h2>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            Orders are typically processed within 1–3 business days. Domestic delivery generally takes 3–7 business days depending on location. International shipping timeframes vary by destination.
          </p>
          <Link
            href={`/${locale}/policies/shipping-policy`}
            className="inline-block font-sans text-xs text-on-surface-variant underline underline-offset-4 hover:text-on-background transition-colors"
          >
            View full shipping policy →
          </Link>
        </div>
      </section>
    </div>
  )
}
