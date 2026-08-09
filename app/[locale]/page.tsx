import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/lib/i18n/config'
import Hero from '@/components/home/Hero'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import EditorialSection from '@/components/home/EditorialSection'
import InlineEmailCapture from '@/components/home/InlineEmailCapture'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import EmailPopup from '@/components/home/EmailPopup'
// Temporarily disabled until real press logos are available.
// import AsSeenIn from '@/components/home/AsSeenIn'
// import ComparisonTable from '@/components/home/ComparisonTable'
// import SocialProof from '@/components/home/SocialProof'
// Temporarily hidden — keep UGC implementation for future re-enable.
// import UgcSocialProof from '@/components/sections/UgcSocialProof'
interface Props {
  params: Promise<{ locale: string }>
}
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function HomePage(props: Props) {
  const params = await props.params
  const { locale } = params

  setRequestLocale(locale)

  return (
    <div className="w-full relative overflow-hidden">
      {/* Atmospheric Backgrounds */}
      <div className="grid-bg"></div>
      <div className="misty-bg"></div>

      <Hero locale={locale} />
      
      <FeaturedProducts 
        handle="new-arrivals" 
        title="New Arrivals" 
        subtitle="Freshly added press-on sets for your next everyday statement."
        ctaLabel="Shop New Arrivals"
        locale={locale} 
      />
      
      {/* Editorial section temporarily hidden
      <EditorialSection locale={locale} />
      */}

      <FeaturedProducts 
        handle="best-sellers" 
        title="Best Sellers" 
        subtitle="Customer-favorite styles, curated for effortless salon-inspired wear."
        ctaLabel="Shop Best Sellers"
        locale={locale} 
      />
      
      {/* Temporarily hidden — keep UGC implementation for future re-enable. */}
      {/* <UgcSocialProof locale={locale} /> */}
      
      {/* Temporarily disabled until real press logos are available. */}
      {/* <AsSeenIn /> */}
      
      {/* Secondary inline email capture block */}
      <InlineEmailCapture />
      
      {/* 
        TODO: Re-enable once real Nailestial product photography is available for Press-On Sets / Nail Care / Accessories categories.
        <CategoryShowcase />
      */}
      
      <EmailPopup />
    </div>
  )
}
