import { notFound } from 'next/navigation'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_COLLECTION } from '@/lib/shopify/queries/collection'
import { PREDICTIVE_SEARCH } from '@/lib/shopify/queries/search'
import { countryMap, type Locale } from '@/lib/i18n/config'
import ProductGrid from '@/components/product/ProductGrid'
import FilterSortBar from '@/components/collections/FilterSortBar'
import type { ShopifyProduct } from '@/lib/shopify/types'

export const revalidate = 3600

interface Props {
  params: Promise<{ handle?: string[]; locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CollectionPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const locale = params.locale as Locale

  const handleArray = params.handle
  const handle = handleArray?.[0]
  const query = typeof searchParams.q === 'string' ? searchParams.q : ''

  const sortValue = searchParams.sort || 'newest'
  let sortKey = 'CREATED'
  let reverse = true

  if (sortValue === 'price-asc') {
    sortKey = 'PRICE'
    reverse = false
  } else if (sortValue === 'price-desc') {
    sortKey = 'PRICE'
    reverse = true
  }

  let products: ShopifyProduct[] = []
  let title = ''

  if (!handle && query) {
    const data = await shopifyFetch<{
      predictiveSearch: { products: ShopifyProduct[] }
    }>(PREDICTIVE_SEARCH, {
      query,
      country: countryMap[locale] ?? 'US',
      language: locale.toUpperCase(),
    })
    products = data.predictiveSearch?.products || []
    title = `Results for "${query}"`
    
    if (sortValue === 'price-asc') {
      products.sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount))
    } else if (sortValue === 'price-desc') {
      products.sort((a, b) => Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount))
    }
  } else {
    const activeHandle = handle || 'all'
    const data = await shopifyFetch<{
      collection: {
        title: string
        products: { nodes: ShopifyProduct[] }
      } | null
    }>(GET_COLLECTION, {
      handle: activeHandle,
      first: 24,
      country: countryMap[locale] ?? 'US',
      language: locale.toUpperCase(),
      sortKey,
      reverse
    })

    if (!data.collection && handle) {
      notFound()
    }

    products = data.collection?.products.nodes || []
    title = data.collection?.title || 'All Objects'
  }

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
