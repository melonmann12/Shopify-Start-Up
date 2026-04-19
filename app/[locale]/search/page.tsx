import { shopifyFetch } from '@/lib/shopify/client'
import { PREDICTIVE_SEARCH } from '@/lib/shopify/queries/search'
import { countryMap, type Locale } from '@/lib/i18n/config'
import ProductGrid from '@/components/product/ProductGrid'
import FilterSortBar from '@/components/collections/FilterSortBar'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const locale = params.locale as Locale
  const query = typeof searchParams.q === 'string' ? searchParams.q : ''

  let products: ShopifyProduct[] = []

  if (query) {
    const data = await shopifyFetch<{
      predictiveSearch: { products: ShopifyProduct[] }
    }>(PREDICTIVE_SEARCH, {
      query,
      country: countryMap[locale] ?? 'US',
      language: locale.toUpperCase(),
    })
    products = data.predictiveSearch.products || []
  }

  // Sort in memory for predictive search results since the predictiveSearch API doesn't take sort parameters directly
  const sortValue = searchParams.sort || 'newest'
  if (sortValue === 'price-asc') {
    products.sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount))
  } else if (sortValue === 'price-desc') {
    products.sort((a, b) => Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount))
  }

  const title = query ? `Results for "${query}"` : 'Search'

  return (
    <div className="w-full">
      {/* Page Header Banner */}
      <section className="w-full bg-surface-container-low py-24 md:py-32 flex justify-center items-center">
        <h1 
          className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-on-surface uppercase text-center max-w-4xl mx-auto px-8" 
          style={{ letterSpacing: '-0.02em' }}
        >
          {title}
        </h1>
      </section>

      {/* Toolbar */}
      <FilterSortBar />

      <ProductGrid products={products} locale={locale} />
    </div>
  )
}

