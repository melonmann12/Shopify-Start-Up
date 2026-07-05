// components/home/SocialProof.tsx
import Link from 'next/link'

interface Props {
  locale?: string
}

export default function SocialProof({ locale = 'en' }: Props) {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-24 md:mb-32 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch pt-16 border-t border-outline-variant/20">
        
        {/* Left Side: Press/Media Logos Placeholder */}
        <div className="flex flex-col justify-between h-full border border-outline-variant/20 bg-surface-container-lowest/5 backdrop-blur-sm p-6 md:p-8">
          <div>
            <span className="text-on-surface-variant mb-4 block text-label">
              Press & Media
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-on-background mb-6 leading-tight">
              As Featured In
            </h3>
            
            {/* Logo Strip Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              {/* 
                TODO: Once press features are secured, replace these dashed placeholder cards 
                with real media logo SVGs or high-resolution PNGs (e.g. Vogue, Elle, Harper's Bazaar).
              */}
              <div className="border border-dashed border-outline-variant/30 h-16 flex items-center justify-center bg-surface-container-low/10">
                <span className="text-on-surface-variant/40 text-caption">Logo Placeholder</span>
              </div>
              <div className="border border-dashed border-outline-variant/30 h-16 flex items-center justify-center bg-surface-container-low/10">
                <span className="text-on-surface-variant/40 text-caption">Logo Placeholder</span>
              </div>
              <div className="border border-dashed border-outline-variant/30 h-16 flex items-center justify-center bg-surface-container-low/10">
                <span className="text-on-surface-variant/40 text-caption">Logo Placeholder</span>
              </div>
            </div>
          </div>
          
          <p className="italic text-on-surface-variant/60 mt-6 text-caption">
            Press mentions coming soon.
          </p>
        </div>

        {/* Right Side: Customer Review/Testimonial Teaser */}
        <div className="flex flex-col justify-between h-full border border-outline-variant/20 bg-surface-container-lowest/5 backdrop-blur-sm p-6 md:p-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-on-surface-variant text-label">
                Customer Voices
              </span>
              <div className="flex items-center gap-0.5 ml-2">
                {/* 5 Mock Star Icons */}
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[14px] text-on-surface/50 select-none">
                    star
                  </span>
                ))}
              </div>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-on-background mb-6 leading-tight">
              Enduring Feedback
            </h3>

            {/* Testimonial Placeholder Block */}
            <div className="border border-outline-variant/20 p-6 bg-surface-container-lowest/10 backdrop-blur-sm mb-6">
              <p className="font-serif italic text-sm text-on-surface-variant leading-relaxed">
                "Reviews coming soon. Customer stories and ratings will automatically appear here once clients start sharing their experience with the initial collection."
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-on-surface-variant font-semibold text-caption">
                  — Verified Collector
                </span>
                <span className="text-outline/80 text-caption">
                  Initial Drop
                </span>
              </div>
            </div>
          </div>

          {/* 
            TODO: Connect reviews app integration here (e.g. Judge.me, Loox, Okendo, or Yotpo)
            and update the link path to a dedicated reviews page or open the reviews widget.
          */}
          <Link 
            href={`/${locale}/about`}
            className="text-xs text-on-surface hover:text-on-surface-variant flex items-center gap-1.5 pb-0.5 border-b border-primary/45 hover:border-primary group self-start transition-colors mt-6 text-label"
          >
            {/* TODO: Update this link to /reviews when created */}
            Read Client Reviews
            <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">
              arrow_forward
            </span>
          </Link>
        </div>

      </div>
    </section>
  )
}
