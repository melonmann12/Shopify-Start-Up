import Image from 'next/image'
import Link from 'next/link'

interface Props {
  locale?: string
}

export default function EditorialSection({ locale = 'en' }: Props) {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-24 md:mb-32 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="order-2 md:order-1 relative glass-card border border-outline-variant/20 p-4 aspect-[4/5] overflow-hidden group rounded-none">
          <div className="w-full h-full relative overflow-hidden bg-surface-container-low border border-outline-variant/10">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf2ec6978MqEb-hyPgN06UxLHxFWDebLA2p2P8xsRaQptg7ihtvdBArQQj604R_sfLwHc5VLJUJnv5XBN0RNseXTSdSAiAevTRRa9Zb2-2MdLRHRf_wOPyj9INHol66P7SfF01XKvMfCDrWU3i7FDiAD3Ncn0nj_TB6QOlD2-Z-oMkF9yq95wj7N6prMkl18o7ob12cj6gz5gtalgD_o-8LPf3cV0K06OPywNidxzx6vLfahVgAxzG4xEzixswNEsCL-Zg-5nTqug7" 
              alt="Minimalist lifestyle photography" 
              fill
              unoptimized
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out saturate-50 contrast-[1.1] opacity-90 mix-blend-multiply" 
            />
          </div>
        </div>
        <div className="order-1 md:order-2 flex flex-col items-start pr-0 lg:pr-24">
          <h2 className="font-serif font-normal text-4xl lg:text-6xl text-on-background tracking-normal leading-[1.15] mb-8">
            QUALITY<br/>OVER<br/>QUANTITY
          </h2>
          <p className="font-serif italic text-lg leading-relaxed text-on-surface-variant mb-10 max-w-md">
            We believe in custom nails that endure. Our design philosophy is rooted in luxury essentialism—handcrafting reusable press-ons that elevate your everyday style without compromising your natural nail health. Every set is an investment in enduring elegance.
          </p>
          <Link 
            href={`/${locale}/about`} 
            className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface hover:text-on-surface-variant flex items-center gap-2 pb-0.5 border-b border-primary group"
          >
            LEARN OUR STORY
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
