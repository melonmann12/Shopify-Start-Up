// components/layout/Navbar.tsx
import Link from 'next/link'
import Image from 'next/image'
import NavClient from './NavClient'

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 border-b border-outline/20 md:backdrop-blur-md">
      <nav aria-label="Top Navigation" className="flex justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 max-w-full mx-auto">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Nailestial"
            width={160}
            height={40}
            className="h-8 sm:h-10 w-auto object-contain"
            priority
          />
        </Link>

        <NavClient />
      </nav>
    </header>
  )
}
