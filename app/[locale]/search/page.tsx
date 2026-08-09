// app/[locale]/search/page.tsx
import { shopifyFetch } from '@/lib/shopify/client'
import { SEARCH_PRODUCTS } from '@/lib/shopify/queries/search'
import { GET_COLLECTIONS } from '@/lib/shopify/queries/collection'
import { countryMap, type Locale } from '@/lib/i18n/config'
import SearchClient from '@/components/search/SearchClient'
import SearchHeroInput from '@/components/search/SearchHeroInput'
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
  collection?: string | string[]
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
  
  const collectionFilterRaw = searchParams.collection
  const collectionFilters = Array.isArray(collectionFilterRaw)
    ? collectionFilterRaw
    : (collectionFilterRaw ? [collectionFilterRaw] : [])
    
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
    case 'best-selling':
      sortKey = 'BEST_SELLING'
      reverse = false
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
      ...(q ? { query: q } : {}),
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

  // 1. Filter by collection handle (OR logic)
  if (collectionFilters.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      p.collections?.nodes?.some((c) => collectionFilters.includes(c.handle))
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
      
      {/* ── Search Hero Section ── */}
      <div className="relative w-full h-[320px] md:h-[420px] pt-[80px] md:pt-[100px] flex flex-col items-center justify-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/search-hero-section-img/Banner - Fall Nails.png" 
            alt="Search Hero" 
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle ivory gradient overlay for text readability without obscuring hands */}
          <div className="absolute inset-0 bg-surface/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface/80 via-surface/40 to-transparent"></div>
        </div>

        {/* Content Layer */}
        <header className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-on-background mb-4 font-normal drop-shadow-sm">
            {q ? `Search Results for "${q}"` : 'All Nails'}
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto text-caption font-medium">
            Explore our luxury, handcrafted press-on nails and beauty essentials.
          </p>
          
          {/* Search Input seamlessly integrated into hero */}
          <SearchHeroInput initialQuery={q} />
        </header>
      </div>

      <main className="px-4 sm:px-8 md:px-12 max-w-[1920px] mx-auto pb-24 relative z-10 mt-6 md:mt-10">

        <SearchClient
          products={filteredProducts as ShopifyProduct[]}
          collections={collections}
          productTypes={allProductTypes}
          locale={locale}
          currentParams={{
            q,
            sort,
            collection: collectionFilters,
            available: availableFilter,
            product_type: productTypeFilter,
          }}
        />
      </main>
    </div>
  )
}
