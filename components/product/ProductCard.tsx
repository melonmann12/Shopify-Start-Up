import Image from 'next/image'
import Link from 'next/link'
import ProductBadge from './ProductBadge'
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
  const badge = product.metafields?.[0]?.value

  return (
    <Link href={`/${locale}/products/${product.handle}`} className="group block">
      {/* Image */}
      <div className="bg-surface-variant aspect-[3/4] mb-8 overflow-hidden relative">
        {image && (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            priority={isPriority}
            loading={isPriority ? "eager" : undefined}
            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
        {badge && <ProductBadge label={badge} />}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <p className="font-body text-xs text-on-surface-variant uppercase tracking-widest">{product.vendor || 'QLBusiness'}</p>
        <h3 className="font-headline text-lg font-semibold text-on-surface">{product.title}</h3>
        <p className="font-body text-sm text-on-surface mt-2">
          {formatPrice(price.amount, price.currencyCode, locale)}
        </p>
      </div>
    </Link>
  )
}

