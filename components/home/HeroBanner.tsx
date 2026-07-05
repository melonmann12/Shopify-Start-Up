// components/home/HeroBanner.tsx
import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full bg-brand-black text-white">
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 font-display text-6xl sm:text-8xl uppercase">
          Start Up
        </h1>
        <p className="mb-8 max-w-md text-lg sm:text-xl">
          The new standard in modern fashion. Built for the bold.
        </p>
        <Link
          href="/vi/products"
          className="rounded-full bg-white px-8 py-4 text-sm font-semibold tracking-wide text-brand-black transition hover:opacity-90 uppercase"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
