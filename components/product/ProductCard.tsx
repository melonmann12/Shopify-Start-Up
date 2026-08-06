import Image from 'next/image'
import ShopifyImage from '@/components/ui/ShopifyImage'
import Link from 'next/link'
import { formatPrice } from '@/lib/currency'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  product: ShopifyProduct
  locale: string
  isPriority?: boolean
  typographyVariant?: 'default' | 'large'
}

export default function ProductCard({ product, locale, isPriority = false, typographyVariant = 'default' }: Props) {
  const image = product.images.nodes[0]
  const secondImage = product.images.nodes[1]
  const price = product.priceRange.minVariantPrice
  const compareAtPriceObj = product.variants?.nodes?.[0]?.compareAtPrice
  const priceAmount = Number(price.amount)
  const compareAtAmount = compareAtPriceObj ? Number(compareAtPriceObj.amount) : null
  const isDiscounted = compareAtAmount !== null && compareAtAmount > priceAmount

  // Badge from metafield — only show if one is explicitly set; skip fallback text
  const badge = product.metafields?.find(
    (m) => m?.namespace === 'custom' && m?.key === 'badge_label'
  )?.value

  return (
    <Link
      href={`/${locale}/products/${product.handle}`}
      className="bg-white border-r border-b border-on-background flex flex-col group h-full transition-all duration-500 rounded-none"
    >
      {/* 1. PRODUCT IMAGE — square crop, fills card top */}
      <div className="w-full aspect-square bg-transparent overflow-hidden relative">
        {image && (
          <ShopifyImage
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            priority={isPriority}
            loading={isPriority ? 'eager' : undefined}
            className={`w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${secondImage ? 'group-hover:opacity-0' : ''}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
        {secondImage && (
          <ShopifyImage
            src={secondImage.url}
            alt={secondImage.altText ?? `${product.title} alternate view`}
            fill
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out hidden md:block"
            sizes="(max-width: 1024px) 50vw, 25vw"
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
      <div className="flex flex-col gap-2 p-3 md:gap-3 md:p-5 mt-auto">
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-[15px] md:text-xl font-normal text-on-background leading-tight">
            {product.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 leading-none">
            <span className={`text-on-surface-variant ${typographyVariant === 'large' ? 'text-label md:text-sm' : 'text-label'}`}>
              {formatPrice(price.amount, price.currencyCode, locale)}
            </span>
            {isDiscounted && compareAtPriceObj && (
              <span className={`text-on-surface-variant/60 line-through ${typographyVariant === 'large' ? 'text-[11px] md:text-xs' : 'text-[10px] sm:text-[11px]'}`}>
                {formatPrice(compareAtPriceObj.amount, compareAtPriceObj.currencyCode, locale)}
              </span>
            )}
          </div>
        </div>

        <div className={`text-on-background group-hover:opacity-50 transition-opacity duration-300 ${typographyVariant === 'large' ? 'text-label md:text-sm md:uppercase md:tracking-wider' : 'text-label'}`}>
          Purchase
        </div>
      </div>
    </Link>
  )
}