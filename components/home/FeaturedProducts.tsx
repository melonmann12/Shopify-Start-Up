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
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-24 md:mb-32 relative z-10">
      <div className="flex justify-between items-end mb-16">
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-on-background tracking-normal">{title}</h2>
        <Link
          href={`/${locale}/collections`}
          className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface hover:text-on-surface-variant flex items-center gap-2 pb-0.5 border-b border-primary group"
        >
          VIEW ALL <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const price = product.priceRange?.minVariantPrice
          const formattedPrice = price
            ? formatPrice(price.amount, price.currencyCode, locale)
            : ''
          const imageUrl = product.featuredImage?.url || product.images?.nodes[0]?.url

          return (
            <Link 
              key={product.id} 
              href={`/${locale}/products/${product.handle}`} 
              className="glass-card border border-outline-variant/20 p-6 flex flex-col justify-between group h-full hover:bg-surface-bright/40 transition-all duration-500 rounded-none relative block"
            >
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] tracking-[0.2em] text-on-surface-variant uppercase">
                  {product.vendor || 'nailestial'}
                </span>
                
                <div className="w-full aspect-[4/3] bg-surface-container-low overflow-hidden relative border border-outline-variant/10">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out saturate-50 contrast-[1.1] opacity-90 mix-blend-multiply"
                    />
                  ) : (
                    <div className="w-full h-full bg-outline-variant/20" />
                  )}
                  {/* Logo hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-surface-bright/90 px-4 py-2 border border-outline-variant/30 md:backdrop-blur-sm shadow-sm">
                      <span className="font-serif text-sm text-on-background">{product.vendor || 'nailestial'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif text-xl font-normal text-on-background leading-tight">
                    {product.title}
                  </h3>
                  <p className="font-mono text-[11px] tracking-[0.15em] text-on-surface-variant uppercase">
                    {formattedPrice}
                  </p>
                </div>

                <div className="border border-on-background self-start px-6 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-on-background group-hover:bg-on-background group-hover:text-surface-bright transition-colors duration-300 rounded-none">
                  Purchase
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
