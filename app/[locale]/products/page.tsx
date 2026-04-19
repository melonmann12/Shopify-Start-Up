// app/[locale]/products/page.tsx
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCTS } from '@/lib/shopify/queries/product'
import { countryMap, type Locale } from '@/lib/i18n/config'
import ProductGrid from '@/components/product/ProductGrid'
import type { ShopifyProduct } from '@/lib/shopify/types'

export const revalidate = 3600

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ProductListingPage(props: Props) {
  const params = await props.params
  const locale = params.locale as Locale
  const country = countryMap[locale] ?? 'US'
  const language = locale.toUpperCase()

  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(
    GET_PRODUCTS,
    { first: 24, country, language }
  )

  return (
    <section className="mx-auto max-w-site px-4 py-12">
      <h1 className="mb-8 font-display text-4xl uppercase">All Products</h1>
      <ProductGrid products={data.products.nodes} locale={locale} />
    </section>
  )
}
