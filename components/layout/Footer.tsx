// components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  locale?: string
}

// ─── Static nav data ─────────────────────────────────────────────────────────
// Shop links use the existing /collections/[[...handle]] route.
// Nail Guide links are informational placeholders — the guide content
// lives in the Shape & Size Guide drawer on the PDP. When dedicated
// guide pages exist, update these hrefs accordingly.
//
// Social links are set to '#' until final brand URLs are confirmed.
// To update: replace '#' with the full URL for each platform.

const SHOP_LINKS = [
  { label: 'Shop All', href: (l: string) => `/${l}/collections/all` },
  { label: 'New Arrivals', href: (l: string) => `/${l}/collections/new-arrivals` },
  { label: 'Best Sellers', href: (l: string) => `/${l}/collections/best-sellers` },
  { label: 'On Sale', href: (l: string) => `/${l}/collections/sale` },
]

const CARE_LINKS = [
  { label: 'Contact & Support', href: (l: string) => `/${l}/contact` },
  { label: 'Track Your Order (soon)', href: (l: string) => `/${l}/track-order` },
  { label: 'Shipping Policy', href: (l: string) => `/${l}/policies/shipping-policy` },
  { label: 'Returns & Exchanges', href: (l: string) => `/${l}/policies/refund-policy` },
  { label: 'FAQ', href: (l: string) => `/${l}/faq` },
]

const GUIDE_LINKS = [
  { label: 'Size & Shape Guide', href: (l: string) => `/${l}/guides/size-and-shape` },
  { label: 'How to Apply', href: (l: string) => `/${l}/guides/how-to-apply` },
  { label: 'How to Remove', href: (l: string) => `/${l}/guides/how-to-remove` },
  { label: "What's Included", href: (l: string) => `/${l}/guides/whats-included` },
  { label: 'Nail Care Tips', href: (l: string) => `/${l}/guides/nail-care-tips` },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: (l: string) => `/${l}/policies/privacy-policy` },
  { label: 'Terms of Service', href: (l: string) => `/${l}/policies/terms-of-service` },
  { label: 'Refund Policy', href: (l: string) => `/${l}/policies/refund-policy` },
  { label: 'Shipping Policy', href: (l: string) => `/${l}/policies/shipping-policy` },
  { label: 'Cookie Policy', href: (l: string) => `/${l}/policies/privacy-policy` },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: '#', // TODO: replace with https://instagram.com/nailestial
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#', // TODO: replace with https://tiktok.com/@nailestial
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
        aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.85 4.85 0 0 1-1-.39z" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: '#', // TODO: replace with https://pinterest.com/nailestial
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
        aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
]

// ─── Shared link style ────────────────────────────────────────────────────────
const linkCls = 'font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors leading-relaxed'

export default function Footer({ locale = 'en' }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-outline/20 bg-surface mt-auto relative z-10">

      {/* ── Main columns ─────────────────────────────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-20
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

        {/* Column 1 — Brand */}
        <div className="space-y-6 sm:col-span-2 lg:col-span-1">
          <Image
            src="/logo.png"
            alt="Nailestial"
            width={140}
            height={36}
            className="h-7 w-auto object-contain brightness-95"
          />
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed max-w-[260px]">
            Luxury press-on nails designed for effortless, salon-inspired beauty at home.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-4 pt-1">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface-variant hover:text-on-background transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2 — Shop */}
        <div className="space-y-5">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
            Shop
          </h3>
          <ul className="space-y-3">
            {SHOP_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href(locale)} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Customer Care */}
        <div className="space-y-5">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
            Customer Care
          </h3>
          <ul className="space-y-3">
            {CARE_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href(locale)} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Nail Guide */}
        <div className="space-y-5">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-on-background">
            Nail Guide
          </h3>
          <ul className="space-y-3">
            {GUIDE_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href(locale)} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div className="border-t border-outline/10">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-5
                        flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-label order-2 sm:order-1">
            © {year} Nailestial. All rights reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 order-1 sm:order-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href(locale)} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </footer>
  )
}
