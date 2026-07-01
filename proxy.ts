import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/lib/i18n/config'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export default function proxy(request: NextRequest) {
  // 1. Strict Bypass for Static & Metadata Files
  const pathname = request.nextUrl.pathname
  if (
    pathname.includes('robots.txt') ||
    pathname.includes('sitemap.xml') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.xml') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.jpg')
  ) {
    return
  }

  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - /api
  // - /_next
  // - /_vercel
  // - public files (covered by the strict bypass above, but kept here for double safety)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
