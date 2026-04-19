// app/[locale]/page.tsx
import HeroBanner from '@/components/home/HeroBanner'
import FeaturedCollection from '@/components/home/FeaturedCollection'
import BrandStory from '@/components/home/BrandStory'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage(props: Props) {
  const params = await props.params
  return (
    <>
      <HeroBanner />
      <FeaturedCollection handle="new-featured" title="New & Featured" />
      <BrandStory />
      <FeaturedCollection handle="new-arrivals" title="New Arrivals" />
    </>
  )
}
