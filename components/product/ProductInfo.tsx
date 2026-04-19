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
        <div 
          className="text-on-surface-variant leading-relaxed font-body [&_ul]:mt-6 [&_ul]:space-y-2 [&_ul]:text-sm [&_li]:flex [&_li]:items-center [&_li]:gap-2 [&_li]:before:content-[''] [&_li]:before:w-1.5 [&_li]:before:h-1.5 [&_li]:before:rounded-full [&_li]:before:bg-outline-variant [&_li]:before:shrink-0"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      </div>
    </div>
  )
}
