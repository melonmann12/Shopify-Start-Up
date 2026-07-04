// lib/currency.ts
//
// IMPORTANT: The `locale` parameter here is the UI display language (e.g. 'vi', 'en'),
// NOT the price formatting locale. We always format prices as USD in en-US style
// because this store sells exclusively in USD to US customers. The UI language and
// the currency formatting locale are entirely separate concerns.
export function formatPrice(
  amount: string,
  currencyCode: string,
  locale?: string   // kept for API compatibility but intentionally not used for formatting
): string {
  const numericAmount = parseFloat(amount)

  // Always format as USD/en-US regardless of UI language.
  // If Shopify Admin is still set to VND, currencyCode will be 'VND' — see note below.
  const safeCurrencyCode = currencyCode ?? 'USD'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: safeCurrencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount)
}
