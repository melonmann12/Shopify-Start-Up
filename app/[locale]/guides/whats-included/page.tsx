// app/[locale]/guides/whats-included/page.tsx
import type { Metadata } from 'next'
import GuidePage from '@/components/guides/GuidePage'

export const metadata: Metadata = {
  title: "What's Included",
  description: "Everything that comes in your Nailestial press-on nail kit — nails, prep tools, adhesive tabs, and more.",
}

interface Props {
  params: Promise<{ locale: string }>
}

const KIT_ITEMS = [
  {
    name: '20 Press-On Nails',
    desc: 'Two of each size (0–9) so you can find your perfect match and have backups for any size.',
  },
  {
    name: 'Adhesive Tabs',
    desc: 'Pre-cut, double-sided adhesive tabs in multiple sizes — one set included. Reorder separately if needed.',
  },
  {
    name: 'Nail Buffer',
    desc: 'A fine-grit buffer to lightly prepare the nail surface before application for stronger adhesion.',
  },
  {
    name: 'Cuticle Stick',
    desc: 'For gently pushing back cuticles and assisting with removal.',
  },
  {
    name: 'Alcohol Prep Pad',
    desc: 'To cleanse and degrease the nail surface immediately before applying adhesive.',
  },
]

const NOTES = [
  'Nail glue is not included by default but is available as an add-on for maximum hold.',
  'Top coat is not included but is recommended to seal the free edge and extend wear.',
  'Exact contents may vary slightly by product. Always check the individual product listing for kit details.',
]

export default async function WhatsIncludedPage({ params }: Props) {
  const { locale } = await params

  return (
    <GuidePage
      title="What's Included"
      intro="Every Nailestial order is carefully assembled so you have everything you need to achieve a flawless application at home."
      locale={locale}
    >
      <div className="space-y-12 mt-10">

        {/* Kit items */}
        <section>
          <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background mb-6">
            In the Box
          </h2>
          <div className="divide-y divide-outline/10">
            {KIT_ITEMS.map(({ name, desc }) => (
              <div key={name} className="py-5 flex gap-6">
                <span className="shrink-0 font-serif italic text-base text-on-background w-40 leading-snug">
                  {name}
                </span>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border border-outline/15 bg-surface-container-lowest p-6 space-y-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
            Please Note
          </p>
          <ul className="space-y-2">
            {NOTES.map((note, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-on-surface-variant/30" />
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{note}</p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </GuidePage>
  )
}
