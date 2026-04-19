// app/[locale]/collections/[handle]/page.tsx
import { notFound } from 'next/navigation'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_COLLECTION } from '@/lib/shopify/queries/collection'
import { countryMap, type Locale } from '@/lib/i18n/config'
import ProductGrid from '@/components/product/ProductGrid'

export const revalidate = 3600

interface Props {
  params: Promise<{ handle: string; locale: string }>
}

export default async function CollectionPage(props: Props) {
  const params = await props.params
  const locale = params.locale as Locale
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
  })

  if (!data.collection) notFound()

  const { collection } = data

  return (
    <section className="mx-auto max-w-site px-4 py-12">
      <h1 className="mb-2 font-display text-4xl uppercase">{collection.title}</h1>
      {collection.description && (
        <p className="mb-8 text-brand-muted">{collection.description}</p>
      )}
      <ProductGrid products={collection.products.nodes} locale={locale} />
    </section>
  )
}
