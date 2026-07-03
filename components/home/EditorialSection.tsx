import Link from 'next/link'

interface Props {
  locale?: string
}

export default function EditorialSection({ locale = 'en' }: Props) {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-24 md:mb-32 relative z-10">
      {/* Top Border Divider */}
      <div className="pt-16 border-t border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Column 1: Craftsmanship/Quality */}
          <div className="flex flex-col items-start h-full">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-on-surface-variant mb-4 block">
              01 / Craftsmanship
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-on-background mb-4 leading-[1.2]">
              Salon-Grade<br />Gel Artistry
            </h3>
            <p className="font-mono text-xs text-on-surface-variant leading-relaxed mb-8 max-w-sm">
              Each set is meticulously handcrafted with multiple layers of premium salon gel. Get the flawless, high-shine finish and durability of a professional manicure from the comfort of home.
            </p>
            {/* 
              TODO: Confirm if the nails are actually made with gel or another material, 
              and verify the "handmade" claim matches production specs before going live.
            */}
            <Link 
              href={`/${locale}/about`}
              className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface hover:text-on-surface-variant flex items-center gap-1.5 pb-0.5 border-b border-primary/45 hover:border-primary group mt-auto transition-colors"
            >
              Our Process
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Column 2: Speed/Ease of Application */}
          <div className="flex flex-col items-start h-full">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-on-surface-variant mb-4 block">
              02 / Simplicity
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-on-background mb-4 leading-[1.2]">
              Flawless in<br />Under 15 Minutes
            </h3>
            <p className="font-mono text-xs text-on-surface-variant leading-relaxed mb-8 max-w-sm">
              Skip the hours at the salon. Apply your set in minutes using our gentle, dual-application adhesive system for a secure, custom fit that lasts up to two weeks.
            </p>
            {/* 
              TODO: Confirm application speed claim (e.g. "under 15 minutes" or "10 minutes")
              and verify the specific wear time (e.g. "up to two weeks") matches product capabilities.
            */}
            <Link 
              href={`/${locale}/about`}
              className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface hover:text-on-surface-variant flex items-center gap-1.5 pb-0.5 border-b border-primary/45 hover:border-primary group mt-auto transition-colors"
            >
              {/* TODO: If a dedicated application page is created, point link there (e.g., /support/application) */}
              Application Guide
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Column 3: Reusability/Value */}
          <div className="flex flex-col items-start h-full">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-on-surface-variant mb-4 block">
              03 / Reusability
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-on-background mb-4 leading-[1.2]">
              Designed for<br />Lifetime Wear
            </h3>
            <p className="font-mono text-xs text-on-surface-variant leading-relaxed mb-8 max-w-sm">
              Wear them for a weekend or weeks. Our durable, non-damaging press-on sets can be easily removed, preserved, and reapplied again and again without losing their shape.
            </p>
            {/* 
              TODO: Confirm durability and reusability claims (e.g. number of wears or "lifetime wear" suitability)
              matches actual product instructions and specifications.
            */}
            <Link 
              href={`/${locale}/about`}
              className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface hover:text-on-surface-variant flex items-center gap-1.5 pb-0.5 border-b border-primary/45 hover:border-primary group mt-auto transition-colors"
            >
              {/* TODO: If a dedicated care guide page is created, point link there (e.g., /support/care) */}
              Care Guide
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">
                arrow_forward
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
