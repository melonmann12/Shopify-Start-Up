// components/product/ProductInfo.tsx
import { formatPrice } from '@/lib/currency'
import VariantSelector from './VariantSelector'
import AddToCartButton from './AddToCartButton'
import ProductBadge from './ProductBadge'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  product: ShopifyProduct
  locale: string
}

export default function ProductInfo({ product, locale }: Props) {
  const badge = product.metafields?.find(
    (m) => m?.namespace === 'custom' && m?.key === 'badge_label'
  )?.value

  const basePrice = product.priceRange.minVariantPrice

  return (
    <div className="flex w-full flex-col">
      <div className="mb-8">
        <h1 className="text-5xl font-headline font-bold text-on-surface tracking-tight mb-2">
          {product.title}
        </h1>
        <p className="text-lg text-on-surface-variant font-label tracking-wide uppercase mb-6">
          {product.vendor || "QLBusiness"}
        </p>
        <p className="text-2xl font-body font-medium text-on-surface">
          {formatPrice(basePrice.amount, basePrice.currencyCode, locale)}
        </p>
      </div>

      <VariantSelector product={product} locale={locale} />

      {/* Description Panel */}
      <div className="bg-surface-container-low p-8 rounded-xl mt-4">
        <h3 className="text-sm font-label text-on-surface-variant uppercase tracking-widest mb-4">Description</h3>
        <p className="text-on-surface-variant leading-relaxed font-body">
          {product.description}
        </p>
        <ul className="mt-6 space-y-2 text-sm text-on-surface-variant font-body">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span> Lightweight construction</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span> Premium quality</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span> Authentic design</li>
        </ul>
      </div>
    </div>
  )
}
