// app/[locale]/guides/nail-care-tips/page.tsx
import type { Metadata } from 'next'
import GuidePage from '@/components/guides/GuidePage'

export const metadata: Metadata = {
  title: 'Nail Care Tips',
  description: 'Care tips to keep your Nailestial press-on nails looking flawless longer and protect your natural nails between wears.',
}

interface Props {
  params: Promise<{ locale: string }>
}

const TIPS = [
  {
    category: 'Before & During Wear',
    items: [
      'Apply to completely dry, oil-free nails. Any moisture or oil will reduce adhesion.',
      'Avoid soaking your hands for extended periods — dish washing, long baths, or swimming will loosen the adhesive faster.',
      'When possible, use gloves for tasks involving prolonged water exposure.',
      'Do not cut or file the press-ons shorter — choose the correct length at purchase instead.',
    ],
  },
  {
    category: 'Extending Wear',
    items: [
      'Seal the free edge with a clear top coat every 2–3 days to prevent lifting.',
      'Avoid using your nails as tools — opening cans, picking at labels, typing with nail tips, and similar habits cause lifting and breakage.',
      'Press down on any corner that begins to lift and hold for 30 seconds. Reapply adhesive if needed.',
    ],
  },
  {
    category: 'After Removal',
    items: [
      'Always apply cuticle oil after removal to restore moisture and flexibility to your nail beds.',
      'Give your natural nails a short break between press-on applications — even 1–2 days helps.',
      'Buff away any residue gently. Do not over-buff — thin nails are more prone to breakage.',
    ],
  },
  {
    category: 'Storing Your Press-Ons',
    items: [
      'Store press-ons in their original box to avoid dust and damage.',
      'Keep them in a cool, dry location away from direct sunlight, which can fade pigments.',
      'Label the box with the size set if you are storing multiple styles.',
    ],
  },
]

export default async function NailCareTipsPage({ params }: Props) {
  const { locale } = await params

  return (
    <GuidePage
      title="Nail Care Tips"
      intro="Small habits make a big difference. These tips will help you get the most out of every set and keep your natural nails healthy between wears."
      locale={locale}
    >
      <div className="space-y-12 mt-10">
        {TIPS.map(({ category, items }) => (
          <section key={category}>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background mb-5">
              {category}
            </h2>
            <ul className="space-y-3 pl-1">
              {items.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-on-surface-variant/30" />
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </GuidePage>
  )
}
