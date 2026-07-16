// app/[locale]/guides/size-and-shape/page.tsx
import type { Metadata } from 'next'
import GuidePage from '@/components/guides/GuidePage'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Size & Shape Guide',
  description: 'Learn how to measure your nails and choose the right size and shape for your Nailestial press-on nails.',
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SizeAndShapeGuidePage({ params }: Props) {
  const { locale } = await params

  return (
    <GuidePage
      title="Size & Shape Guide"
      intro="Finding your perfect fit makes all the difference. Follow these steps to measure your nails and choose your ideal shape."
      locale={locale}
    >
      <div className="space-y-12 mt-10">

        {/* Section 1 */}
        <section>
          <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background mb-4">
            How to Measure Your Nails
          </h2>
          <ol className="space-y-4">
            {[
              'Using a soft tape measure or a thin strip of paper, measure across the widest part of each nail bed — not the nail plate.',
              'Record the measurement in millimeters (mm) for each finger, from thumb to pinky.',
              'If you are between sizes, we recommend sizing down for a snug, lasting fit.',
              'Custom sizing is available. Select "Custom" on the product page and leave your measurements in the notes.',
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 font-serif text-lg text-on-surface-variant/40 leading-tight">
                  0{i + 1}
                </span>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="border-t border-outline/10" />

        {/* Section 2 */}
        <section>
          <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background mb-4">
            Choosing Your Shape
          </h2>
          <div className="space-y-5">
            {[
              { shape: 'Almond', desc: 'Slim sides tapering to a soft rounded peak. Elongates the finger and is flattering on most hand types.' },
              { shape: 'Coffin', desc: 'Tapered sides with a flat squared-off tip. Bold, dramatic, and very on-trend.' },
              { shape: 'Stiletto', desc: 'Long and pointed for a striking editorial look. Best for those comfortable with length.' },
              { shape: 'Round', desc: 'Classic and understated. Follows the natural nail curve — great for everyday wear.' },
              { shape: 'Square', desc: 'Clean straight sides with a flat tip. Timeless and structured.' },
              { shape: 'Oval', desc: 'Similar to almond but softer. Versatile and elegant — suits most nail lengths.' },
            ].map(({ shape, desc }) => (
              <div key={shape} className="flex gap-4 pb-5 border-b border-outline/10 last:border-0 last:pb-0">
                <span className="shrink-0 font-serif italic text-base text-on-background w-20">{shape}</span>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-outline/10" />

        {/* Section 3 */}
        <section>
          <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background mb-4">
            Still Unsure?
          </h2>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            Each product page has a{' '}
            <span className="font-serif italic">Size &amp; Shape Guide</span>{' '}
            button above the option selector with detailed visuals. You can also{' '}
            <Link href={`/${locale}/contact`} className="underline underline-offset-4 hover:text-on-background transition-colors">
              contact our team
            </Link>{' '}
            and we will help you find the right fit.
          </p>
        </section>
      </div>
    </GuidePage>
  )
}
