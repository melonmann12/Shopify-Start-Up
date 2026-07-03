import Hero from '@/components/home/Hero'
import TrustBar from '@/components/home/TrustBar'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import EditorialSection from '@/components/home/EditorialSection'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import EmailPopup from '@/components/home/EmailPopup'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage(props: Props) {
  const params = await props.params
  const { locale } = params

  return (
    <div className="w-full relative overflow-hidden">
      {/* Atmospheric Backgrounds */}
      <div className="grid-bg"></div>
      <div className="misty-bg"></div>

      <Hero locale={locale} />
      <TrustBar />
      <FeaturedProducts handle="new-arrivals" title="Curated Selection" locale={locale} />
      <EditorialSection locale={locale} />
      <CategoryShowcase />
      <EmailPopup />
    </div>
  )
}
