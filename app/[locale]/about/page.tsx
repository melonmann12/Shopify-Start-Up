import type { Metadata } from 'next'
import { type Locale } from '@/lib/i18n/config'
import StoryHero from '@/components/about/StoryHero'
import VisionSection from '@/components/about/VisionSection'
import ProcessGrid from '@/components/about/ProcessGrid'
import QuoteSection from '@/components/about/QuoteSection'
import StoryCta from '@/components/about/StoryCta'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Crafted for the modern icon. We believe in the enduring power of considered design.',
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AboutPage(props: Props) {
  const params = await props.params
  const locale = params.locale as Locale

  return (
    <div className="w-full">
      <StoryHero />
      <VisionSection />
      <ProcessGrid />
      <QuoteSection />
      <StoryCta locale={locale} />
    </div>
  )
}
