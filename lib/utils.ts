/** Merge Tailwind classes safely (vanilla JS class merger) */
export function cn(...inputs: any[]) {
  return inputs.flat().filter(Boolean).join(' ')
}

/** Format a Shopify money object into a display string (always en-US / USD style).
 *  NOTE: prefer importing formatPrice from '@/lib/currency' instead of here. */
export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode ?? 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount))
}

/** Pluralise a word based on count */
export function pluralise(count: number, word: string): string {
  return count === 1 ? word : `${word}s`
}
