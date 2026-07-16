// components/guides/GuidePage.tsx
// Shared layout wrapper used by all Nail Guide informational pages.
// Keeps visual structure consistent: eyebrow label → h1 → intro → content.
import Link from 'next/link'
import type { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title: string
  intro?: string
  locale: string
  children: ReactNode
}

export default function GuidePage({ eyebrow = 'Nail Guide', title, intro, locale, children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="px-6 md:px-16 pt-16 pb-10 max-w-3xl mx-auto text-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-on-surface-variant mb-4">
          {eyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-on-background leading-tight mb-6">
          {title}
        </h1>
        {intro && (
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-xl mx-auto">
            {intro}
          </p>
        )}
      </section>

      {/* Body content */}
      <section className="px-6 md:px-16 pb-24 max-w-2xl mx-auto">
        {children}
      </section>

      {/* Footer CTA */}
      <div className="border-t border-outline/10 py-12 text-center">
        <p className="font-serif italic text-lg text-on-background mb-3">Ready to shop?</p>
        <Link
          href={`/${locale}/collections/all`}
          className="inline-block font-sans text-xs font-medium text-on-background border border-on-background/30 hover:border-on-background px-8 py-3 transition-colors"
        >
          Shop All Nails
        </Link>
      </div>
    </div>
  )
}
