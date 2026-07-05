// app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n/config'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import CartDrawer from '@/components/cart/CartDrawer'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: { default: 'Nailestial | Luxury Press-On Nails', template: '%s | Nailestial' },
  description: 'Shop premium, handcrafted reusable press-on nails. Experience salon-quality luxury manicures at home with Nailestial.',
}

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout(props: Props) {
  const { children } = props
  const params = await props.params
  const { locale } = params

  if (!locales.includes(locale as Locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="text-on-background font-body antialiased min-h-screen flex flex-col pt-20 relative z-0 overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <AnnouncementBar />
          <Navbar locale={locale} />
          <CartDrawer />
          <main className="flex-grow">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
