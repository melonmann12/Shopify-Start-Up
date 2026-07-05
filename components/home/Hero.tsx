import Image from 'next/image'
import Link from 'next/link'

interface Props {
  locale: string
}

export default function Hero({ locale }: Props) {
  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[90vh] border-b border-outline-variant/20">
      {/* 
        FUTURE BACKGROUND IMAGE PLACEHOLDER
        To add a single large full-width background image behind the text later:
        1. Uncomment the block below
        2. Set the correct `src` and `alt` properties
        3. Make sure the section container has `relative` and appropriate styling
      */}
      {/* 
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/path-to-your-new-hero-image.jpg"
          alt="Nailestial Luxury Hero"
          fill
          priority
          className="w-full h-full object-cover"
          sizes="100vw"
        />
        // Optional dark/light contrast overlay
        <div className="absolute inset-0 bg-black/5" />
      </div>
      */}

      {/* Floating Text Layer */}
      <div className="relative z-10 text-center px-4 md:px-0 py-24 flex flex-col items-center pointer-events-auto">
        <h1 className="font-serif text-[46px] md:text-[80px] text-primary max-w-4xl mx-auto leading-tight mb-8 font-normal tracking-tight">
          Handcrafted<br />
          Luxury Press-On<br />
          <span className="italic">Nails</span>
        </h1>
        <Link
          href={`/${locale}/collections`}
          className="inline-block border border-primary px-8 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white transition-colors duration-200"
        >
          VIEW ITEMS
        </Link>
      </div>
    </section>
  )
}
