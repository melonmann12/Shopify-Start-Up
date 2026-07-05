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
  // favicon icons are injected manually via <link> tags in <head> below
  // so that we can use media queries for light/dark theme switching —
  // Next.js metadata.icons API does not support the media attribute.
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
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Nunito+Sans:ital,opsz,wght@0,6..12,300;0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;1,6..12,400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

        {/* Theme-aware favicon
            Strategy: static media-conditional <link> tags for Safari/Firefox +
            an inline matchMedia script for Chrome (which ignores media on <link rel="icon">).
            public/logo-icon-black.png → light mode (black logo on white tab bar)
            public/logo-icon-white.png → dark  mode (white logo on dark  tab bar) */}

        {/* 1. Fallback — shown when no media query matches or JS is disabled */}
        <link rel="icon" type="image/png" href="/logo-icon-black.png" />
        {/* 2. Conditionals last — these override the fallback in supporting browsers */}
        <link rel="icon" type="image/png" media="(prefers-color-scheme: light)" href="/logo-icon-black.png" />
        <link rel="icon" type="image/png" media="(prefers-color-scheme: dark)"  href="/logo-icon-white.png" />
        {/* 3. Apple home-screen icon — always the black version for iOS contrast */}
        <link rel="apple-touch-icon" href="/logo-icon-black.png" />

        {/* 4. matchMedia script — Chrome does not honour the media attribute on
            <link rel="icon">, so we update the href imperatively and watch for
            OS-level theme changes at runtime. dangerouslySetInnerHTML is used
            so Next.js does not escape the inline JS. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var BLACK='/logo-icon-black.png';
  var WHITE='/logo-icon-white.png';
  function applyFavicon(){
    var dark=window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches;
    var href=(dark?WHITE:BLACK)+'?t='+(dark?'d':'l');
    var el=document.querySelector('link[data-tf]');
    if(!el){
      el=document.createElement('link');
      el.rel='icon';el.type='image/png';
      el.setAttribute('data-tf','1');
      document.head.appendChild(el);
    }
    el.href=href;
  }
  applyFavicon();
  if(window.matchMedia)window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',applyFavicon);
})();`,
          }}
        />
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
