import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/currency'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  product: ShopifyProduct
  locale: string
  isPriority?: boolean
}

export default function ProductCard({ product, locale, isPriority = false }: Props) {
  const image = product.images.nodes[0]
  const price = product.priceRange.minVariantPrice

  // Badge from metafield — only show if one is explicitly set; skip fallback text
  const badge = product.metafields?.find(
    (m) => m?.namespace === 'custom' && m?.key === 'badge_label'
  )?.value

  return (
    <Link
      href={`/${locale}/products/${product.handle}`}
      className="bg-white border border-outline-variant/20 shadow-sm flex flex-col group h-full hover:shadow-md transition-all duration-500 rounded-none"
    >
      {/* 1. PRODUCT IMAGE — portrait crop, fills card top */}
      <div className="w-full aspect-[3/4] bg-transparent overflow-hidden relative">
        {image && (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            priority={isPriority}
            loading={isPriority ? 'eager' : undefined}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
        {/* Badge overlaid on image — only when explicitly set in metafield */}
        {badge && (
          <div className="absolute top-3 left-3 border border-white/60 bg-white/80 backdrop-blur-sm px-2 py-0.5">
            <span className="text-on-background text-label">{badge}</span>
          </div>
        )}
      </div>

      {/* 2. PRODUCT INFO — title, price, purchase CTA */}
      <div className="flex flex-col gap-3 p-5 mt-auto">
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-xl font-normal text-on-background leading-tight">
            {product.title}
          </h3>
          <p className="text-on-surface-variant text-label">
            {formatPrice(price.amount, price.currencyCode, locale)}
          </p>
        </div>

        <div className="text-on-background group-hover:opacity-50 transition-opacity duration-300 text-label">
          Purchase
        </div>
      </div>
    </Link>
  )
}