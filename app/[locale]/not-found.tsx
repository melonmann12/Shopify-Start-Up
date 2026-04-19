// app/[locale]/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-display text-6xl uppercase">404</h1>
      <p className="text-brand-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="rounded-full bg-brand-black px-8 py-3 text-sm font-medium text-white transition hover:opacity-80"
      >
        Back to Home
      </Link>
    </div>
  )
}
