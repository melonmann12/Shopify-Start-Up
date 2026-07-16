// app/[locale]/guides/how-to-remove/page.tsx
import type { Metadata } from 'next'
import GuidePage from '@/components/guides/GuidePage'

export const metadata: Metadata = {
  title: 'How to Remove',
  description: 'Remove your Nailestial press-on nails safely and without damage so you can reuse them.',
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HowToRemovePage({ params }: Props) {
  const { locale } = await params

  return (
    <GuidePage
      title="How to Remove"
      intro="Proper removal protects both your natural nails and the press-ons, so you can reuse them again and again."
      locale={locale}
    >
      <div className="space-y-12 mt-10">

        <section>
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-serif text-3xl text-on-surface-variant/20 leading-none">01</span>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
              Soak
            </h2>
          </div>
          <div className="pl-12 space-y-3">
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Fill a small bowl with warm soapy water. Soak your fingertips for 10–15 minutes. This gently loosens the adhesive tab without force.
            </p>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Alternatively, you can soak a cotton ball with nail polish remover (acetone-free is gentler) and press it against the cuticle edge for 30–60 seconds.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-serif text-3xl text-on-surface-variant/20 leading-none">02</span>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
              Loosen
            </h2>
          </div>
          <div className="pl-12 space-y-3">
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Using the cuticle stick or an orange stick, gently insert the tip under the cuticle edge of the press-on. Work slowly in a side-to-side motion, not a prying motion.
            </p>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              You should feel the press-on lift gradually. If you feel resistance, soak longer — never force it.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-serif text-3xl text-on-surface-variant/20 leading-none">03</span>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
              Remove & Clean
            </h2>
          </div>
          <div className="pl-12 space-y-3">
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Once loose, slide the nail off gently from the cuticle toward the tip.
            </p>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Peel any remaining adhesive residue from your natural nail using the buffer — never scrape. Apply a nourishing cuticle oil afterward to restore moisture.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-serif text-3xl text-on-surface-variant/20 leading-none">04</span>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
              Store for Reuse
            </h2>
          </div>
          <div className="pl-12 space-y-3">
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Clean the inside of each press-on with a dry cotton ball to remove adhesive residue. Store them in their original box in a cool, dry place. They are ready to wear again.
            </p>
          </div>
        </section>

        <div className="border border-outline/15 bg-surface-container-lowest p-6 space-y-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
            Important
          </p>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            Never peel, yank, or force a press-on off. This is the leading cause of thin, weakened natural nails. Patience during removal preserves the health of your nail beds and the longevity of the press-ons.
          </p>
        </div>

      </div>
    </GuidePage>
  )
}
