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
          <h4 className="font-headline font-bold text-lg text-primary">SHIPPING</h4>
          <p className="text-xs leading-loose text-on-surface-variant text-label">
            Complimentary standard shipping on all domestic orders. Express options available at checkout.
          </p>
          <Link href={`/${locale}/policies/shipping-policy`} className="inline-block text-xs text-primary border-b border-primary/30 hover:border-primary transition-colors pb-1 mt-4 text-label">
            Read Full Policy
          </Link>
        </div>
        {/* Returns */}
        <div className="space-y-6">
          <h4 className="font-headline font-bold text-lg text-primary">RETURNS</h4>
          <p className="text-xs leading-loose text-on-surface-variant text-label">
            Returns accepted within 14 days for damaged items or sizing consultation errors.
          </p>
          <Link href={`/${locale}/policies/refund-policy`} className="inline-block text-xs text-primary border-b border-primary/30 hover:border-primary transition-colors pb-1 mt-4 text-label">
            Start a Return
          </Link>
        </div>
        {/* Privacy */}
        <div className="space-y-6">
          <h4 className="font-headline font-bold text-lg text-primary">PRIVACY</h4>
          <p className="text-xs leading-loose text-on-surface-variant text-label">
            We respect your privacy. Your information is securely encrypted and never shared.
          </p>
          <Link href={`/${locale}/policies/privacy-policy`} className="inline-block text-xs text-primary border-b border-primary/30 hover:border-primary transition-colors pb-1 mt-4 text-label">
            View Privacy Terms
          </Link>
        </div>
      </div>
    </section>
  )
}
