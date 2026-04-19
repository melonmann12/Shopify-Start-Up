// components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 max-w-7xl mx-auto">
        <div className="text-lg font-black text-zinc-900 dark:text-white font-headline mb-6 md:mb-0">
          QLBusiness
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-['Inter'] text-sm tracking-wide uppercase text-zinc-400 dark:text-zinc-500 mb-6 md:mb-0">
          <Link className="hover:text-zinc-900 dark:hover:text-white underline-offset-4 hover:underline transition-colors" href="#">Sustainability</Link>
          <Link className="hover:text-zinc-900 dark:hover:text-white underline-offset-4 hover:underline transition-colors" href="#">Shipping</Link>
          <Link className="hover:text-zinc-900 dark:hover:text-white underline-offset-4 hover:underline transition-colors" href="#">Returns</Link>
          <Link className="hover:text-zinc-900 dark:hover:text-white underline-offset-4 hover:underline transition-colors" href="#">Privacy</Link>
        </div>
        
        <div className="text-zinc-600 dark:text-zinc-400 font-['Inter'] text-sm">
          © 2024 QLBusiness. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
