import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/lib/i18n/config'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export default function proxy(request: NextRequest) {
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
