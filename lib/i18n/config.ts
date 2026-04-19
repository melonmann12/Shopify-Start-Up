// lib/i18n/config.ts
export const locales = ['en', 'vi'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'vi'

export const currencyMap: Record<Locale, string> = {
  en: 'USD',
  vi: 'VND',
}

export const countryMap: Record<Locale, string> = {
  en: 'US',
  vi: 'VN',
}
