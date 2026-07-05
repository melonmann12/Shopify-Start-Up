// components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  locale?: string
}

export default function Footer({ locale = 'en' }: Props) {
  return (
    <footer className="w-full border-t border-outline/20 bg-surface/80 md:backdrop-blur-sm mt-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 max-w-full mx-auto">
        <div className="mb-6 md:mb-0">
          <Image
            src="/logo.png"
            alt="Nailestial"
            width={140}
            height={36}
            className="h-7 w-auto object-contain brightness-95"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-on-surface-variant mb-6 md:mb-0 text-center text-label">
          <Link className="hover:text-on-background transition-colors" href={`/${locale}/policies/privacy-policy`}>Privacy Policy</Link>
          <Link className="hover:text-on-background transition-colors" href={`/${locale}/policies/terms-of-service`}>Terms of Service</Link>
          <Link className="hover:text-on-background transition-colors" href={`/${locale}/policies/refund-policy`}>Refund Policy</Link>
          <Link className="hover:text-on-background transition-colors" href={`/${locale}/policies/shipping-policy`}>Shipping Policy</Link>
          <Link className="hover:text-on-background transition-colors" href={`/${locale}/contact`}>Contact & Support</Link>
        </div>
        <div className="text-on-surface-variant text-label">
          © {new Date().getFullYear()} nailestial
        </div>
      </div>
    </footer>
  )
}
