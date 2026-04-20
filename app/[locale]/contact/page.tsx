import type { Metadata } from 'next'
import SupportHero from '@/components/support/SupportHero'
import FaqAccordion from '@/components/support/FaqAccordion'
import ContactForm from '@/components/support/ContactForm'
import LegalLinks from '@/components/support/LegalLinks'

export const metadata: Metadata = {
  title: 'Support Center',
  description: 'How can we help you today? Access FAQs, support, and legal information.',
}

export default function ContactPage() {
  return (
    <div className="w-full">
      <SupportHero />
      <FaqAccordion />
      <ContactForm />
      <LegalLinks />
    </div>
  )
}
