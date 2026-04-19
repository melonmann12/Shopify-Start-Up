// components/layout/Navbar.tsx
import Link from 'next/link'
import NavClient from './NavClient'

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl">
      <nav aria-label="Top Navigation" className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto shadow-[0_20px_40px_rgba(45,52,53,0.06)]">
        <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white font-headline">
          QLBusiness
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 font-['Manrope'] font-medium tracking-tight">
          {['Men', 'Women', 'Kids', 'Sale'].map((item) => (
            <Link 
              key={item}
              href={`/en/products`} 
              className={`transition-all duration-200 px-3 py-1 rounded-DEFAULT ${
                item === 'Women' 
                ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white pb-1 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        <NavClient />
      </nav>
    </header>
  )
}
