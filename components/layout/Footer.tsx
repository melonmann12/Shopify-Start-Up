// components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full border-t border-outline/20 bg-surface/80 md:backdrop-blur-sm mt-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 max-w-full mx-auto">
        <div className="text-xl font-normal text-on-background font-serif mb-6 md:mb-0">
          nailestial
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 font-mono text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-6 md:mb-0">
          <Link className="hover:text-on-background transition-colors" href="/en/policies/privacy-policy">Privacy Policy</Link>
          <Link className="hover:text-on-background transition-colors" href="/en/policies/terms-of-service">Terms of Service</Link>
          <Link className="hover:text-on-background transition-colors" href="/en/contact">Accessibility</Link>
          <Link className="hover:text-on-background transition-colors" href="/en/contact">Contact & Support</Link>
        </div>
        <div className="text-on-surface-variant font-mono text-[10px] uppercase tracking-[0.1em]">
          © 2024 nailestial
        </div>
      </div>
    </footer>
  )
}
