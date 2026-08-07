import { shopifyFetch } from '@/lib/shopify/client'
import { GET_UGC_ITEMS } from '@/lib/shopify/queries/ugc'
import { countryMap } from '@/lib/i18n/config'

export type UgcItem = {
  id: string
  filename: string
  src: string
  sortOrder: number
  active: boolean
  altText: string
  product: {
    id: string
    title: string
    handle: string
    availableForSale?: boolean
  } | null
}

const FALLBACK_UGC_IMAGES = [
  'ugc_1619.AVIF',
  'ugc_1621.AVIF',
  'ugc_1622.AVIF',
  'ugc_1623.WEBP',
  'ugc_1624.WEBP',
  'ugc_1625.AVIF',
  'ugc_1626.AVIF',
  'ugc_1627.AVIF',
  'ugc_1628.WEBP',
  'ugc_1629.WEBP',
  'ugc_1630.AVIF',
  'ugc_1631.WEBP',
  'ugc_1632.WEBP',
  'ugc_1633.AVIF',
  'ugc_1634.WEBP',
  'ugc_1635.JPG',
  'ugc_1636.AVIF'
]

const FALLBACK_UGC_ITEMS: UgcItem[] = FALLBACK_UGC_IMAGES.map((filename, index) => ({
  id: `fallback-${index}`,
  filename,
  src: `/feedback/${filename}`,
  sortOrder: index,
  active: true,
  altText: 'Customer wearing Nailestial press-on nails',
  product: null
}))

const FILENAME_REGEX = /^[a-zA-Z0-9_.-]+\.(avif|webp|jpg|jpeg|png)$/i

function isValidFilename(filename: string): boolean {
  if (!filename) return false
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) return false
  if (filename.includes('://')) return false
  return FILENAME_REGEX.test(filename)
}

export async function getUgcItems(locale: string = 'en'): Promise<UgcItem[]> {
  const country = countryMap[locale as keyof typeof countryMap] ?? 'US'
  const language = locale.toUpperCase()

  try {
    const data = await shopifyFetch<any>(GET_UGC_ITEMS, {
      language,
      country,
    })

    const nodes = data?.metaobjects?.nodes || []
    
    if (nodes.length === 0) {
      return FALLBACK_UGC_ITEMS
    }

    const items: UgcItem[] = nodes
      .map((node: any) => {
        const active = node.active?.value === 'true'
        const filename = node.filename?.value || ''
        
        if (!active || !isValidFilename(filename)) {
          return null
        }

        const sortOrder = parseInt(node.sortOrder?.value || '999', 10)
        const altText = node.altText?.value || ''
        const productRef = node.productField?.reference

        return {
          id: node.id,
          filename,
          src: `/feedback/${filename}`,
          sortOrder: isNaN(sortOrder) ? 999 : sortOrder,
          active,
          altText,
          product: productRef ? {
            id: productRef.id,
            title: productRef.title,
            handle: productRef.handle,
            availableForSale: productRef.availableForSale
          } : null
        }
      })
      .filter(Boolean)

    if (items.length === 0) {
      return FALLBACK_UGC_ITEMS
    }

    // Sort by sortOrder ascending
    return items.sort((a, b) => a.sortOrder - b.sortOrder)
  } catch (error) {
    console.error('Error fetching UGC Metaobjects, falling back to local data', error)
    return FALLBACK_UGC_ITEMS
  }
}
