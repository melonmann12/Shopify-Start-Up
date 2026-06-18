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
    <div className="w-full relative overflow-hidden">
      {/* Atmospheric Backgrounds */}
      <div className="grid-bg"></div>
      <div className="misty-bg"></div>

      <main className="pt-[100px] px-8 md:px-12 max-w-[1920px] mx-auto pb-24 relative z-10">
        {/* Header Section */}
        <header className="flex flex-col items-center justify-center mb-16 relative z-10 text-center py-12">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-on-background mb-6 tracking-tight font-normal leading-tight">
            All Products
          </h1>
          <p className="font-mono text-[10px] text-on-surface-variant max-w-2xl mx-auto uppercase tracking-[0.25em] opacity-85 leading-relaxed">
            Curated essentials for a refined aesthetic. Tailored treatments and elevated experiences.
          </p>
        </header>

        <ProductGrid products={data.products.nodes} locale={locale} />
      </main>
    </div>
  )
}
