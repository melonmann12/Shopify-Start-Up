// app/[locale]/search/page.tsx
import { shopifyFetch } from '@/lib/shopify/client'
import { SEARCH_PRODUCTS } from '@/lib/shopify/queries/search'
import { GET_COLLECTIONS } from '@/lib/shopify/queries/collection'
import { countryMap, type Locale } from '@/lib/i18n/config'
import SearchClient from '@/components/search/SearchClient'
import type { ShopifyProduct } from '@/lib/shopify/types'

export const revalidate = 0 // Search results should be dynamic

interface CollectionsResponse {
  collections: {
    nodes: {
      id: string
      title: string
      handle: string
    }[]
  }
}

interface ProductsResponse {
  products: {
    nodes: (ShopifyProduct & {
      collections?: { nodes: { handle: string; title: string }[] }
    })[]
  }
}

interface SearchParams {
  q?: string
  sort?: string
  collection?: string
  available?: string
  product_type?: string
}

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}

export default async function SearchPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams

  const locale = params.locale as Locale
  const country = countryMap[locale] ?? 'US'
  const language = locale.toUpperCase()

  // Parse search params
  const q = searchParams.q || ''
  const sort = searchParams.sort || 'relevance'
  const collectionFilter = searchParams.collection || ''
  const availableFilter = searchParams.available || ''
  const productTypeFilter = searchParams.product_type || ''

  // Map sort options to Shopify Storefront API variables
  let sortKey = 'RELEVANCE'
  let reverse = false

  switch (sort) {
    case 'price-asc':
      sortKey = 'PRICE'
      reverse = false
      break
    case 'price-desc':
      sortKey = 'PRICE'
      reverse = true
      break
    case 'title-asc':
      sortKey = 'TITLE'
      reverse = false
      break
    case 'newest':
      sortKey = 'CREATED_AT'
      reverse = true
      break
    case 'relevance':
    default:
      sortKey = 'RELEVANCE'
      reverse = false
      break
  }

  // Execute Shopify Product Search Query (up to 100 products)
  let products: ProductsResponse['products']['nodes'] = []
  try {
    const data = await shopifyFetch<ProductsResponse>(SEARCH_PRODUCTS, {
      query: q,
      first: 100,
      sortKey,
      reverse,
      country,
      language,
    })
    products = data?.products?.nodes || []
  } catch (error) {
    console.error('[Search API Fetch Error]:', error)
  }

  // Fetch collections for filter list
  let collections: CollectionsResponse['collections']['nodes'] = []
  try {
    const data = await shopifyFetch<CollectionsResponse>(GET_COLLECTIONS, {
      first: 100,
      country,
      language,
    })
    collections = data?.collections?.nodes || []
  } catch (error) {
    console.error('[Search page collections fetch error]:', error)
  }

  // Calculate unique product types for filtering
  const allProductTypes = Array.from(
    new Set(
      products
        .map((p) => p.productType)
        .filter((t) => typeof t === 'string' && t.trim() !== '')
    )
  )

  // Hybrid Filter Logic on Server:
  let filteredProducts = [...products]

  // 1. Filter by collection handle
  if (collectionFilter) {
    filteredProducts = filteredProducts.filter((p) =>
      p.collections?.nodes?.some((c) => c.handle === collectionFilter)
    )
  }

  // 2. Filter by availability
  if (availableFilter === 'true') {
    filteredProducts = filteredProducts.filter((p) =>
      p.variants?.nodes?.some((v) => v.availableForSale)
    )
  }

  // 3. Filter by product type
  if (productTypeFilter) {
    filteredProducts = filteredProducts.filter(
      (p) => p.productType?.toLowerCase() === productTypeFilter.toLowerCase()
    )
  }

  return (
    <div className="w-full relative overflow-hidden bg-surface min-h-screen">
      <main className="pt-[100px] px-4 sm:px-8 md:px-12 max-w-[1920px] mx-auto pb-24 relative z-10">
        <header className="flex flex-col items-center justify-center mb-10 text-center py-6">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-on-background mb-4 font-normal">
            {q ? `Search Results for "${q}"` : 'Search Products'}
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto text-caption">
            Explore our luxury, handcrafted press-on nails and beauty essentials.
          </p>
        </header>

        <SearchClient
          products={filteredProducts as ShopifyProduct[]}
          collections={collections}
          productTypes={allProductTypes}
          locale={locale}
          currentParams={{
            q,
            sort,
            collection: collectionFilter,
            available: availableFilter,
            product_type: productTypeFilter,
          }}
        />
      </main>
    </div>
  )
}
