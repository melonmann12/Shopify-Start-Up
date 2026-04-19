// lib/currency.ts
export function formatPrice(
  amount: string,
  currencyCode: string,
  locale: string
): string {
  const numericAmount = parseFloat(amount)
  const displayLocale = locale === 'vi' ? 'vi-VN' : 'en-US'

  return new Intl.NumberFormat(displayLocale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'VND' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'VND' ? 0 : 2,
  }).format(numericAmount)
}
