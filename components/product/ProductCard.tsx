// components/product/ProductCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import ProductBadge from './ProductBadge'
import { formatPrice } from '@/lib/currency'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  product: ShopifyProduct
  locale: string
}

export default function ProductCard({ product, locale }: Props) {
  const image = product.images.nodes[0]
  const price = product.priceRange.minVariantPrice
  const badge = product.metafields?.[0]?.value

  return (
    <Link href={`/${locale}/products/${product.handle}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {image && (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        )}
        {badge && <ProductBadge label={badge} />}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-brand-muted">{product.vendor}</p>
        <h3 className="text-sm font-medium leading-snug">{product.title}</h3>
        <p className="text-sm font-medium">
          {formatPrice(price.amount, price.currencyCode, locale)}
        </p>
      </div>
    </Link>
  )
}
