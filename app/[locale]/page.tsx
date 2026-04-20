import Hero from '@/components/home/Hero'
import TrustBar from '@/components/home/TrustBar'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import EditorialSection from '@/components/home/EditorialSection'
import CategoryShowcase from '@/components/home/CategoryShowcase'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage(props: Props) {
  const params = await props.params
  const { locale } = params

  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedProducts handle="new-arrivals" title="Curated Selection" locale={locale} />
      <EditorialSection locale={locale} />
      <CategoryShowcase />
    </>
  )
}
