import Image from 'next/image'
import Link from 'next/link'

interface Props {
  locale: string
}

export default function Hero({ locale }: Props) {
  return (
    <section className="relative w-full overflow-hidden flex flex-col justify-end min-h-[90vh] md:min-h-[85vh] lg:min-h-[90vh] border-b border-outline-variant/20">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/hero-section-image/img1.png"
          alt="Nailestial Luxury Hero"
          fill
          priority
          className="w-full h-full object-cover object-center"
          sizes="100vw"
        />
        {/* No gradient overlays - image is clean and natural */}
      </div>

      {/* Floating Text Layer - Lower Left Editorial Block */}
      <div className="relative z-10 text-left px-6 md:pl-[8%] pb-16 md:pb-[16%] lg:pb-[14%] flex flex-col items-start pointer-events-auto w-full max-w-full">
        <div className="max-w-[360px] md:max-w-[420px]">
          <h1 className="font-serif text-[32px] md:text-[38px] lg:text-[44px] text-on-background leading-tight mb-4 font-normal tracking-wide">
            Handcrafted<br />
            Press-On Nails
          </h1>
          <p className="font-sans text-sm md:text-[15px] text-on-surface-variant leading-relaxed mb-8">
            Luxury, reusable sets made for everyday wear.
          </p>
          <Link
            href={`/${locale}/collections`}
            className="inline-block border border-on-background bg-white/90 backdrop-blur-sm px-10 py-3.5 text-on-background font-medium hover:bg-on-background hover:text-surface transition-all duration-300 text-label self-start uppercase tracking-widest shadow-sm"
          >
            VIEW ITEMS
          </Link>
        </div>
      </div>
    </section>
  )
}
