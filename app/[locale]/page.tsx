import Hero from '@/components/home/Hero'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import EditorialSection from '@/components/home/EditorialSection'
import ComparisonTable from '@/components/home/ComparisonTable'
import SocialProof from '@/components/home/SocialProof'
import InlineEmailCapture from '@/components/home/InlineEmailCapture'
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
      
      <FeaturedProducts handle="new-arrivals" title="Curated Selection" locale={locale} />
      
      {/* Three short feature columns covering Quality, Speed, and Reusability */}
      <EditorialSection locale={locale} />
      
      {/* Comparison block of Nailestial vs. traditional press-ons vs. salons */}
      <ComparisonTable />
      
      {/* Social proof strip showing press logo & review placeholders */}
      <SocialProof locale={locale} />
      
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
