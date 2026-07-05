// components/home/BrandStory.tsx
import Link from 'next/link'

export default function BrandStory() {
  return (
    <section className="bg-brand-gray-50">
      <div className="mx-auto grid max-w-site grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 lg:py-24">
        {/* Placeholder for editorial image */}
        <div className="aspect-[4/5] w-full bg-brand-border"></div>

        <div className="flex flex-col items-start px-4 md:px-12 lg:px-24">
          <h2 className="mb-6 font-display text-5xl leading-none uppercase">
            Crafted for the Modern Era.
          </h2>
          <p className="mb-8 text-lg text-brand-muted">
            We believe in restraint, precision, and bold aesthetic. Our designs push the boundaries of modern fashion while remaining timeless.
          </p>
          <Link
            href="/vi/about"
            className="border-b-2 border-brand-black pb-1 text-sm font-semibold transition hover:opacity-60 uppercase"
          >
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  )
}
