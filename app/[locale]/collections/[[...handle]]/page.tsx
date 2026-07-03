import { notFound } from 'next/navigation'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_COLLECTION } from '@/lib/shopify/queries/collection'
import { GET_PRODUCTS } from '@/lib/shopify/queries/product'
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

interface CollectionResponse {
  collection: {
    title: string
    products: { nodes: ShopifyProduct[] }
  } | null
}

interface ProductsResponse {
  products: {
    nodes: ShopifyProduct[]
  }
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

  // Debug variables logging in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('[Collections Route Audit] Route Parameters:', {
      locale,
      handleArray,
      handle,
      query,
      sortValue,
      sortKey,
      reverse,
    })
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
    let activeHandle = handle || 'all'
    let collectionData: { title: string; products: { nodes: ShopifyProduct[] } } | null = null

    // 1. Fetch from Shopify Collection first
    const data = await shopifyFetch<CollectionResponse>(GET_COLLECTION, {
      handle: activeHandle,
      first: 24,
      country: countryMap[locale] ?? 'US',
      language: locale.toUpperCase(),
      sortKey,
      reverse
    })

    collectionData = data.collection

    // 2. Fallback Guard: If handle is 'all' or 'all-nails' and the collection is empty/null,
    // attempt query swap or fetch all products directly to avoid rendering blank screens.
    if (!collectionData && (activeHandle === 'all' || activeHandle === 'all-nails')) {
      if (activeHandle === 'all') {
        if (process.env.NODE_ENV === 'development') {
          console.log("[Collections Route Audit] 'all' collection returned null. Trying 'all-nails'...")
        }
        const altData = await shopifyFetch<CollectionResponse>(GET_COLLECTION, {
          handle: 'all-nails',
          first: 24,
          country: countryMap[locale] ?? 'US',
          language: locale.toUpperCase(),
          sortKey,
          reverse
        })
        if (altData.collection) {
          collectionData = altData.collection
          activeHandle = 'all-nails'
        }
      }

      // If still null, query the entire products catalog directly
      if (!collectionData) {
        if (process.env.NODE_ENV === 'development') {
          console.log("[Collections Route Audit] Both collections null. Querying all products directly...")
        }
        
        // Translate CREATED sorting parameter to ProductSortKeys schema (CREATED_AT)
        const productSortKey = sortKey === 'CREATED' ? 'CREATED_AT' : sortKey
        const allProductsData = await shopifyFetch<ProductsResponse>(GET_PRODUCTS, {
          first: 24,
          country: countryMap[locale] ?? 'US',
          language: locale.toUpperCase(),
          sortKey: productSortKey,
          reverse
        })

        if (allProductsData.products?.nodes) {
          collectionData = {
            title: 'All Nails',
            products: { nodes: allProductsData.products.nodes }
          }
        }
      }
    }

    if (!collectionData && handle) {
      notFound()
    }

    products = collectionData?.products.nodes || []
    title = collectionData?.title || 'All Nails'
  }

  return (
    <div className="w-full relative overflow-hidden">
      {/* Atmospheric Backgrounds */}
      <div className="grid-bg"></div>
      <div className="misty-bg"></div>

      <main className="pt-[100px] px-6 md:px-12 max-w-[1920px] mx-auto pb-24 relative z-10">
        {/* Header Section */}
        <header className="flex flex-col items-center justify-center mb-16 relative z-10 text-center py-12">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-on-background mb-6 tracking-tight font-normal leading-tight uppercase">
            {title}
          </h1>
          <p className="font-mono text-[10px] text-on-surface-variant max-w-2xl mx-auto uppercase tracking-[0.25em] opacity-85 leading-relaxed">
            Curated essentials for a refined aesthetic. Tailored treatments and elevated experiences.
          </p>
        </header>

        {/* Toolbar */}
        <FilterSortBar />

        <ProductGrid products={products} locale={locale} />
      </main>
    </div>
  )
}
