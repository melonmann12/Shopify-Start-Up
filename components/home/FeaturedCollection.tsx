// components/home/FeaturedCollection.tsx
import Link from 'next/link'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_COLLECTION } from '@/lib/shopify/queries/collection'
import { countryMap } from '@/lib/i18n/config'
import ProductGrid from '@/components/product/ProductGrid'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  handle: string
  title: string
  locale?: string
}

export default async function FeaturedCollection({ handle, title, locale = 'vi' }: Props) {
  const data = await shopifyFetch<{
    collection: { products: { nodes: ShopifyProduct[] } } | null
  }>(GET_COLLECTION, {
    handle,
    first: 4,
    country: countryMap[locale as keyof typeof countryMap] ?? 'VN',
    language: locale.toUpperCase(),
  })

  const products = data?.collection?.products?.nodes || []

  if (products.length === 0) return null

  return (
    <section className="mx-auto max-w-site py-16 px-4">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-4xl uppercase">{title}</h2>
        <Link
          href={`/${locale}/collections/${handle}`}
          className="text-sm font-semibold underline underline-offset-4"
        >
          Shop All
        </Link>
      </div>
      <ProductGrid products={products} locale={locale} />
    </section>
  )
}
