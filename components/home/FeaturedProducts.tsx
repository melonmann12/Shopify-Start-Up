import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_COLLECTION } from '@/lib/shopify/queries/collection'
import { GET_PRODUCTS } from '@/lib/shopify/queries/product'
import { countryMap } from '@/lib/i18n/config'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  handle: string
  title: string
  subtitle?: string
  ctaLabel?: string
  locale?: string
}

export default async function FeaturedProducts({ handle, title, subtitle, ctaLabel = 'VIEW ALL', locale = 'en' }: Props) {
  const country = countryMap[locale as keyof typeof countryMap] ?? 'US'
  const language = locale.toUpperCase()

  const data = await shopifyFetch<{
    collection: { products: { nodes: ShopifyProduct[] } } | null
  }>(GET_COLLECTION, {
    handle,
    first: 4,
    country,
    language,
  })

  let products = data?.collection?.products?.nodes || []

  if (products.length === 0) {
    const fallbackData = await shopifyFetch<{
      products: { nodes: ShopifyProduct[] }
    }>(GET_PRODUCTS, {
      first: 4,
      country,
      language,
    })
    products = fallbackData?.products?.nodes || []
  }

  if (products.length === 0) return null

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-24 md:mb-32 pt-16 md:pt-24 mt-8 md:mt-12 relative z-10 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-on-background tracking-normal mb-3">{title}</h2>
          {subtitle && (
            <p className="text-on-surface-variant text-base">
              {subtitle}
            </p>
          )}
        </div>
        <Link
          href={`/${locale}/collections/${handle}`}
          className="text-xs text-on-surface hover:text-on-surface-variant flex items-center gap-2 pb-0.5 border-b border-primary group text-label shrink-0"
        >
          {ctaLabel} <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-on-background">
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            locale={locale} 
            isPriority={index < 4}
          />
        ))}
      </div>
    </section>
  )
}
