import Link from 'next/link'
import Image from 'next/image'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_COLLECTION } from '@/lib/shopify/queries/collection'
import { countryMap } from '@/lib/i18n/config'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { formatPrice } from '@/lib/currency'

interface Props {
  handle: string
  title: string
  locale?: string
}

export default async function FeaturedProducts({ handle, title, locale = 'en' }: Props) {
  const data = await shopifyFetch<{
    collection: { products: { nodes: ShopifyProduct[] } } | null
  }>(GET_COLLECTION, {
    handle,
    first: 4,
    country: countryMap[locale as keyof typeof countryMap] ?? 'US',
    language: locale.toUpperCase(),
  })

  const products = data?.collection?.products?.nodes || []

  if (products.length === 0) return null

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-40">
      <div className="flex justify-between items-end mb-16">
        <h2 className="font-headline font-bold text-3xl md:text-4xl tracking-tight">{title}</h2>
        <Link
          href={`/${locale}/collections/${handle}`}
          className="font-headline font-bold text-sm tracking-widest uppercase text-on-surface hover:text-on-surface-variant flex items-center gap-2 pb-1 border-b border-primary"
        >
          VIEW ALL <span className="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
        {products.map((product) => {
          const price = product.priceRange?.minVariantPrice
          const formattedPrice = price
            ? formatPrice(price.amount, price.currencyCode, locale)
            : ''
          const imageUrl = product.featuredImage?.url || product.images?.nodes[0]?.url

          return (
            <Link key={product.id} href={`/${locale}/products/${product.handle}`} className="group cursor-pointer block">
              <div className="aspect-[3/4] bg-surface-variant mb-6 overflow-hidden relative">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                ) : (
                  <div className="w-full h-full bg-outline-variant/20" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {product.vendor || 'QLBusiness'}
                </span>
                <h3 className="font-body text-base font-medium text-on-surface mt-1">{product.title}</h3>
                <span className="font-body text-sm font-bold text-on-surface mt-2">{formattedPrice}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
