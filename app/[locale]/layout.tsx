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
  title: { default: 'tiaranails', template: '%s | tiaranails' },
  description: 'A high-end headless e-commerce storefront for tiaranails.',
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
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="text-on-background font-body antialiased min-h-screen flex flex-col pt-24 relative z-0 overflow-x-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#d1d8cf]/30 blur-[150px] rounded-full"></div>
          <div className="absolute top-[10%] right-[-15%] w-[60%] h-[80%] bg-[#b2c0c7]/20 blur-[180px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[15%] w-[50%] h-[60%] bg-[#f9f9f7]/60 blur-[120px] rounded-full"></div>
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-[#d1d8cf]/20 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[55%] h-[55%] bg-[#b2c0c7]/25 blur-[150px] rounded-full"></div>
        </div>
        <NextIntlClientProvider messages={messages}>
          <AnnouncementBar />
          <Navbar />
          <CartDrawer />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
