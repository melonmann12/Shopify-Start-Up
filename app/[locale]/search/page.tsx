// app/[locale]/search/page.tsx
import { shopifyFetch } from '@/lib/shopify/client'
import { PREDICTIVE_SEARCH } from '@/lib/shopify/queries/search'
import { countryMap, type Locale } from '@/lib/i18n/config'
import ProductGrid from '@/components/product/ProductGrid'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const locale = params.locale as Locale
  const query = searchParams.q ?? ''

  let products: ShopifyProduct[] = []

  if (query) {
    const data = await shopifyFetch<{
      predictiveSearch: { products: ShopifyProduct[] }
    }>(PREDICTIVE_SEARCH, {
      query,
      country: countryMap[locale] ?? 'US',
      language: locale.toUpperCase(),
    })
    products = data.predictiveSearch.products
  }

  return (
    <section className="mx-auto max-w-site px-4 py-12">
      <h1 className="mb-8 font-display text-4xl uppercase">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>
      {products.length > 0 ? (
        <ProductGrid products={products} locale={locale} />
      ) : (
        query && <p className="text-brand-muted">No products found for &ldquo;{query}&rdquo;.</p>
      )}
    </section>
  )
}
