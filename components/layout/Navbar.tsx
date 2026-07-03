// components/layout/Navbar.tsx
import Link from 'next/link'
import NavClient from './NavClient'

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 border-b border-outline/20 md:backdrop-blur-md">
      <nav aria-label="Top Navigation" className="flex justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 max-w-full mx-auto">
        <Link href="/" className="text-2xl font-normal tracking-tight text-on-background font-serif">
          nailestial
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-12 font-mono text-[10px] uppercase tracking-[0.2em]">
          <Link href="/en/collections" className="text-on-surface-variant hover:text-on-background transition-colors duration-200">
            Collections
          </Link>
          <Link href="/en/collections/new-arrivals" className="text-on-surface-variant hover:text-on-background transition-colors duration-200">
            New Arrivals
          </Link>
          <Link href="/en/about" className="text-on-surface-variant hover:text-on-background transition-colors duration-200">
            Our Story
          </Link>
        </div>

        <NavClient />
      </nav>
    </header>
  )
}
