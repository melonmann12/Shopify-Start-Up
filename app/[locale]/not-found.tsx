// app/[locale]/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex-grow flex items-center justify-center relative overflow-hidden px-8 py-20 md:py-32 h-[75vh]">
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        <h1 className="font-headline font-black text-[10rem] md:text-[14rem] leading-none text-surface-container-high mb-6 md:mb-8 select-none">
          404
        </h1>
        <h2 className="font-headline font-bold text-3xl md:text-5xl text-primary mb-6 uppercase">
          LOST IN MINIMALISM.
        </h2>
        <p className="font-body text-on-surface-variant text-base md:text-lg leading-relaxed max-w-md mx-auto mb-12">
          The page you are looking for has been moved or curated out of existence. Let&apos;s get you back to the collection.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary text-on-primary px-10 py-4 text-sm hover:bg-primary-fixed transition-colors duration-300 font-semibold text-label"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  )
}
