import type { Metadata } from 'next'
import SupportHero from '@/components/support/SupportHero'
import FaqAccordion from '@/components/support/FaqAccordion'
import ContactForm from '@/components/support/ContactForm'
import LegalLinks from '@/components/support/LegalLinks'

export const metadata: Metadata = {
  title: 'Support Center | Nailestial',
  description: 'How can we help you today? Access FAQs, support, and legal information.',
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ContactPage(props: Props) {
  const params = await props.params
  const { locale } = params

  return (
    <div className="w-full">
      <SupportHero />
      <FaqAccordion />
      <ContactForm />
      <LegalLinks locale={locale} />
    </div>
  )
}
