// components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200/20 w-full mt-20 flex flex-col items-center gap-8 py-16 px-8">
      <div className="font-headline font-bold text-zinc-900 text-xl tracking-tighter">
        QLBusiness
      </div>
      <nav className="flex flex-wrap justify-center gap-8 max-w-2xl text-center">
        <Link className="font-label text-xs tracking-widest uppercase leading-loose text-zinc-400 hover:text-zinc-900 transition-colors" href="/en/policies/privacy-policy">Privacy Policy</Link>
        <Link className="font-label text-xs tracking-widest uppercase leading-loose text-zinc-400 hover:text-zinc-900 transition-colors" href="/en/policies/terms-of-service">Terms of Service</Link>
        <Link className="font-label text-xs tracking-widest uppercase leading-loose text-zinc-400 hover:text-zinc-900 transition-colors" href="/en/contact">Accessibility</Link>
        <Link className="font-label text-xs tracking-widest uppercase leading-loose text-zinc-400 hover:text-zinc-900 transition-colors" href="/en/contact">Contact & Support</Link>
      </nav>
      <div className="font-label text-xs tracking-widest uppercase leading-loose text-zinc-400 mt-8 text-center max-w-sm">
        © 2024 QLBusiness Editorial. All rights reserved.
      </div>
    </footer>
  )
}
