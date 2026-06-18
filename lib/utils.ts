/** Merge Tailwind classes safely (vanilla JS class merger) */
export function cn(...inputs: any[]) {
  return inputs.flat().filter(Boolean).join(' ')
}

/** Format a Shopify money object into a display string */
export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'VND' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'VND' ? 0 : 2,
  }).format(parseFloat(amount))
}

/** Pluralise a word based on count */
export function pluralise(count: number, word: string): string {
  return count === 1 ? word : `${word}s`
}
