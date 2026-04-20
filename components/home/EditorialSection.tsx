import Image from 'next/image'
import Link from 'next/link'

interface Props {
  locale?: string
}

export default function EditorialSection({ locale = 'en' }: Props) {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-40">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="order-2 md:order-1 relative bg-surface-variant aspect-[4/5] overflow-hidden">
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf2ec6978MqEb-hyPgN06UxLHxFWDebLA2p2P8xsRaQptg7ihtvdBArQQj604R_sfLwHc5VLJUJnv5XBN0RNseXTSdSAiAevTRRa9Zb2-2MdLRHRf_wOPyj9INHol66P7SfF01XKvMfCDrWU3i7FDiAD3Ncn0nj_TB6QOlD2-Z-oMkF9yq95wj7N6prMkl18o7ob12cj6gz5gtalgD_o-8LPf3cV0K06OPywNidxzx6vLfahVgAxzG4xEzixswNEsCL-Zg-5nTqug7" 
            alt="Minimalist lifestyle photography" 
            fill
            unoptimized
            className="object-cover object-center" 
          />
        </div>
        <div className="order-1 md:order-2 flex flex-col items-start pr-0 lg:pr-24">
          <h2 className="font-headline font-extrabold text-4xl lg:text-6xl tracking-tighter leading-tight mb-8">
            QUALITY<br/>OVER<br/>QUANTITY
          </h2>
          <p className="font-body text-lg leading-relaxed text-on-surface-variant mb-10 max-w-md">
            We believe in objects that last. Our design philosophy is rooted in essentialism—removing the unnecessary to highlight the purity of form, material, and construction. Every piece is an investment in enduring style.
          </p>
          <Link href={`/${locale}/about`} className="font-headline font-bold text-sm tracking-widest uppercase text-on-surface hover:text-on-surface-variant flex items-center gap-2 pb-1 border-b border-primary group">
            LEARN OUR STORY
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
