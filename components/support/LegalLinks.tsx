import Link from 'next/link'

interface Props {
  locale?: string
}

export default function LegalLinks({ locale = 'en' }: Props) {
  return (
    <section className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
        {/* Shipping */}
        <div className="space-y-6">
          <h4 className="font-headline font-bold text-lg text-primary tracking-tight">SHIPPING</h4>
          <p className="font-label text-xs uppercase tracking-widest leading-loose text-on-surface-variant">
            Complimentary standard shipping on all domestic orders. Express options available at checkout.
          </p>
          <Link href={`/${locale}/policies/shipping-policy`} className="inline-block font-label text-xs uppercase tracking-widest text-primary border-b border-primary/30 hover:border-primary transition-colors pb-1 mt-4">
            Read Full Policy
          </Link>
        </div>
        {/* Returns */}
        <div className="space-y-6">
          <h4 className="font-headline font-bold text-lg text-primary tracking-tight">RETURNS</h4>
          <p className="font-label text-xs uppercase tracking-widest leading-loose text-on-surface-variant">
            Returns accepted within 14 days for damaged items or sizing consultation errors.
          </p>
          <Link href={`/${locale}/policies/refund-policy`} className="inline-block font-label text-xs uppercase tracking-widest text-primary border-b border-primary/30 hover:border-primary transition-colors pb-1 mt-4">
            Start a Return
          </Link>
        </div>
        {/* Privacy */}
        <div className="space-y-6">
          <h4 className="font-headline font-bold text-lg text-primary tracking-tight">PRIVACY</h4>
          <p className="font-label text-xs uppercase tracking-widest leading-loose text-on-surface-variant">
            We respect your privacy. Your information is securely encrypted and never shared.
          </p>
          <Link href={`/${locale}/policies/privacy-policy`} className="inline-block font-label text-xs uppercase tracking-widest text-primary border-b border-primary/30 hover:border-primary transition-colors pb-1 mt-4">
            View Privacy Terms
          </Link>
        </div>
      </div>
    </section>
  )
}
