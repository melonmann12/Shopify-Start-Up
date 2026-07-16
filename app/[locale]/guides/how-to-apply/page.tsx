// app/[locale]/guides/how-to-apply/page.tsx
import type { Metadata } from 'next'
import GuidePage from '@/components/guides/GuidePage'

export const metadata: Metadata = {
  title: 'How to Apply',
  description: 'Step-by-step guide to applying your Nailestial press-on nails for a flawless, long-lasting result.',
}

interface Props {
  params: Promise<{ locale: string }>
}

const STEPS = [
  {
    title: 'Prep Your Nails',
    steps: [
      'Remove any old polish or existing nails.',
      'Wash your hands thoroughly and dry completely.',
      'Gently push back your cuticles using the cuticle stick included in your prep kit.',
      'Lightly buff the surface of each nail using the buffer. This roughens the nail bed for better adhesion.',
      'Wipe each nail with the alcohol prep pad and let them dry fully. Avoid touching your nails after this step.',
    ],
  },
  {
    title: 'Size and Match',
    steps: [
      'Lay out all 20 press-on nails and match each one to the correct nail bed.',
      'The press-on should sit flush against your cuticle edge without overlapping your skin.',
      'If two sizes look close, choose the smaller one for a more natural fit.',
    ],
  },
  {
    title: 'Apply',
    steps: [
      'Peel the backing from an adhesive tab (or apply a small dot of nail glue to the press-on, not the natural nail).',
      'Align the press-on from your cuticle edge and press down firmly.',
      'Hold for 20–30 seconds, applying even pressure across the entire nail.',
      'Repeat for all ten nails. Work one hand at a time.',
    ],
  },
  {
    title: 'Finish',
    steps: [
      'Avoid water, soap, and hand cream for at least one hour after application.',
      'For extra hold, apply a clear top coat along the free edge where the press-on meets your natural nail.',
    ],
  },
]

export default async function HowToApplyPage({ params }: Props) {
  const { locale } = await params

  return (
    <GuidePage
      title="How to Apply"
      intro="A clean prep is the key to nails that last. Set aside 20–30 minutes for the full process — rushing the prep is the most common reason press-ons lift early."
      locale={locale}
    >
      <div className="space-y-12 mt-10">
        {STEPS.map(({ title, steps }, i) => (
          <section key={title}>
            <div className="flex items-baseline gap-4 mb-5">
              <span className="font-serif text-3xl text-on-surface-variant/20 leading-none">0{i + 1}</span>
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
                {title}
              </h2>
            </div>
            <ul className="space-y-3 pl-12">
              {steps.map((step, j) => (
                <li key={j} className="flex gap-3">
                  <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-on-surface-variant/30" />
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{step}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="border border-outline/15 bg-surface-container-lowest p-6 mt-4 space-y-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
            Pro Tip
          </p>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            Apply your nails in the evening before bed. The adhesive cures and strengthens overnight, meaning your nails are at their most secure the next morning.
          </p>
        </div>
      </div>
    </GuidePage>
  )
}
