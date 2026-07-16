// app/[locale]/faq/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Nailestial luxury press-on nails — sizing, application, shipping, and more.',
}

interface Props {
  params: Promise<{ locale: string }>
}

const FAQS = [
  {
    q: 'How do I choose the right size?',
    a: "Measure the widest part of each nail bed in millimeters. Compare with our Size & Shape Guide available on every product page. If you're between sizes, size down for a snug fit.",
  },
  {
    q: 'How long do press-on nails last?',
    a: 'With proper application and care, Nailestial press-on nails can last 1–2 weeks. Avoid prolonged water exposure and use our prep kit for the best adhesion.',
  },
  {
    q: 'Are the nails reusable?',
    a: 'Yes. Our press-on nails are designed to be gently removed and reused multiple times. Store them in their original box between uses.',
  },
  {
    q: 'How do I apply the nails?',
    a: 'Clean and prep your nail bed, choose the correct size, apply the adhesive tab or glue, press firmly for 30 seconds. Full application guidance is included in every order.',
  },
  {
    q: 'How do I remove them without damage?',
    a: 'Soak your fingertips in warm soapy water for 5–10 minutes, then gently slide the nail from the cuticle edge. Never force or peel — this protects both the press-on and your natural nail.',
  },
  {
    q: 'Do you offer custom sizes?',
    a: 'Yes. Select the "Custom" size option on the product page and leave your nail measurements in the notes field at checkout.',
  },
  {
    q: 'Where do you ship?',
    a: 'We ship domestically across Vietnam and internationally to select countries. Shipping details are shown at checkout.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 14 days for damaged or incorrect items. Please contact us before returning.',
  },
]

export default async function FaqPage({ params }: Props) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="px-6 md:px-12 pt-16 pb-12 max-w-3xl mx-auto text-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-on-surface-variant mb-4">
          Help Centre
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-on-background leading-tight mb-6">
          Frequently Asked Questions
        </h1>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
          Everything you need to know about sizing, application, shipping, and care.
        </p>
      </section>

      {/* FAQ list */}
      <section className="px-6 md:px-12 pb-24 max-w-2xl mx-auto">
        <div className="divide-y divide-outline/15">
          {FAQS.map((item, i) => (
            <details key={i} className="group py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between gap-4 select-none">
                <span className="font-sans text-sm font-medium text-on-background leading-snug">
                  {item.q}
                </span>
                <span className="shrink-0 text-on-surface-variant group-open:rotate-45 transition-transform duration-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 font-sans text-sm text-on-surface-variant leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-16 border border-outline/15 bg-surface-container-lowest p-8 text-center space-y-3">
          <p className="font-serif italic text-lg text-on-background">Still have questions?</p>
          <p className="font-sans text-xs text-on-surface-variant">
            Our team is happy to help with sizing, orders, or anything else.
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block mt-2 font-sans text-xs font-medium text-on-background border border-on-background/30 hover:border-on-background px-6 py-3 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
