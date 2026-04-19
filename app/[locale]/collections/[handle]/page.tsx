import { notFound } from 'next/navigation'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_COLLECTION } from '@/lib/shopify/queries/collection'
import { countryMap, type Locale } from '@/lib/i18n/config'
import ProductGrid from '@/components/product/ProductGrid'
import FilterSortBar from '@/components/collections/FilterSortBar'

export const revalidate = 3600

interface Props {
  params: Promise<{ handle: string; locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CollectionPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const locale = params.locale as Locale

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

  const data = await shopifyFetch<{
    collection: {
      title: string
      description: string
      products: { nodes: Parameters<typeof ProductGrid>[0]['products'] }
    } | null
  }>(GET_COLLECTION, {
    handle: params.handle,
    first: 24,
    country: countryMap[locale] ?? 'US',
    language: locale.toUpperCase(),
    sortKey,
    reverse
  })

  if (!data.collection) notFound()

  const { collection } = data

  return (
    <div className="w-full">
      {/* Page Header Banner */}
      <section className="w-full bg-surface-container-low py-24 md:py-32 flex justify-center items-center">
        <h1 
          className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-on-surface uppercase text-center max-w-4xl mx-auto px-8" 
          style={{ letterSpacing: '-0.02em' }}
        >
          {collection.title}
        </h1>
      </section>

      {/* Toolbar */}
      <FilterSortBar />

      {/* Product Grid (Contains Pagination structurally, though currently disabled in HTML template except visually) */}
      <ProductGrid products={collection.products.nodes} locale={locale} />
    </div>
  )
}
