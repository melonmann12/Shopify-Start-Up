'use client'

import { useState } from 'react'

const FAQS = [
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of delivery for items in their original, unused condition. Refunds are issued to the original payment method. Please note that bespoke or personalized items are final sale and cannot be returned."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order has shipped, you will receive an email with a tracking link. You can also log into your account to view the status of your order at any time."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we offer complimentary standard shipping on all domestic orders and offer expedited and international shipping at checkout. Customs and import duties are calculated at checkout."
  },
  {
    question: "How can I request a repair?",
    answer: "We stand behind the quality of our craftsmanship. If your item requires repair, please send a message using the form below with your order number and details regarding the issue."
  }
]

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 md:py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-3xl mx-auto">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div key={index} className="border-b border-outline-variant/20 py-8">
              <div 
                className={`flex justify-between items-center cursor-pointer group ${isOpen ? 'mb-6' : ''}`} 
                onClick={() => toggleOpen(index)}
              >
                <h3 className={`font-headline font-bold text-xl tracking-tight transition-colors ${isOpen ? 'text-primary' : 'text-primary group-hover:text-tertiary-fixed'}`}>
                  {faq.question}
                </h3>
                <span className={`material-symbols-outlined transition-transform duration-300 transform ${isOpen ? 'rotate-45 text-primary' : 'text-primary group-hover:text-tertiary-fixed'}`}>
                  add
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="font-body text-base text-on-surface-variant leading-loose pr-12">
                  {faq.answer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
