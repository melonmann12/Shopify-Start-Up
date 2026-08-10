// components/product/YouMayAlsoLike.tsx
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCTS } from '@/lib/shopify/queries/product'
import { GET_COLLECTION } from '@/lib/shopify/queries/collection'
import { countryMap } from '@/lib/i18n/config'
import type { ShopifyProduct } from '@/lib/shopify/types'
import ProductCard from '@/components/product/ProductCard'

interface Props {
  currentProductId: string
  locale: string
  collectionHandle?: string
}

export default async function YouMayAlsoLike({ currentProductId, locale = 'en', collectionHandle }: Props) {
  const country = countryMap[locale as keyof typeof countryMap] ?? 'US'
  const language = locale.toUpperCase()

  let products: ShopifyProduct[] = []

  if (collectionHandle) {
    const data = await shopifyFetch<{
      collection: { products: { nodes: ShopifyProduct[] } }
    }>(GET_COLLECTION, {
      handle: collectionHandle,
      first: 5,
      country,
      language,
      sortKey: 'BEST_SELLING'
    })
    products = data?.collection?.products?.nodes || []
  }

  // Fallback to global best selling if no collection or not enough products
  // (we need at least 1 product besides the current one)
  if (products.length < 2) {
    const data = await shopifyFetch<{
      products: { nodes: ShopifyProduct[] }
    }>(GET_PRODUCTS, {
      first: 5,
      country,
      language,
      sortKey: 'BEST_SELLING'
    })
    products = data?.products?.nodes || []
  }

  // Filter out the current product and take top 4
  products = products.filter(p => p.id !== currentProductId).slice(0, 4)

  if (products.length === 0) return null

  return (
    <section className="w-full border-t border-black/10 pt-4 md:pt-6 lg:pt-8 mt-0 md:mt-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-on-background tracking-normal mb-3">
            You May Also Like
          </h2>
          <p className="text-on-surface-variant text-base">
            Discover other styles curated for you.
          </p>
        </div>
      </div>
      
      {/* Use the exact same grid as ProductGrid (All Nails) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-on-background">
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            locale={locale} 
            isPriority={false}
          />
        ))}
      </div>
    </section>
  )
}
