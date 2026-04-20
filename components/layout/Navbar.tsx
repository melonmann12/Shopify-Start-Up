// components/layout/Navbar.tsx
import Link from 'next/link'
import NavClient from './NavClient'

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl">
      <nav aria-label="Top Navigation" className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto shadow-[0_20px_40px_rgba(45,52,53,0.06)]">
        <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-900 font-headline">
          QLBusiness
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 font-['Manrope'] font-semibold tracking-tight">
          <Link href="/en/collections" className="text-zinc-500 hover:text-zinc-900 transition-all duration-300 active:scale-95">
            Collections
          </Link>
          <Link href="/en/collections/new-arrivals" className="text-zinc-500 hover:text-zinc-900 transition-all duration-300 active:scale-95">
            New Arrivals
          </Link>
          <Link href="/en/about" className="text-zinc-500 hover:text-zinc-900 transition-all duration-300 active:scale-95">
            Our Story
          </Link>
        </div>

        <NavClient />
      </nav>
    </header>
  )
}
