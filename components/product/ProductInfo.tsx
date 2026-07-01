// components/product/ProductInfo.tsx
import { formatPrice } from '@/lib/currency'
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
      <div className="mb-12">
        <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em] mb-4">
          {product.vendor || "QLBusiness"}
        </p>
        <h1 className="text-5xl lg:text-6xl font-serif font-normal text-on-background tracking-normal mb-6 leading-tight">
          {product.title}
        </h1>
        <p className="text-3xl font-serif text-on-background">
          {formatPrice(basePrice.amount, basePrice.currencyCode, locale)}
        </p>
      </div>

      {/* Description Panel */}
      <div className="border-t border-outline/20 pt-8 mt-8">
        <h3 className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em] mb-6">Description</h3>
        <div 
          className="text-on-surface-variant leading-relaxed font-sans text-sm font-light [&_p]:mb-4 [&_ul]:mt-6 [&_ul]:space-y-3 [&_ul]:text-sm [&_li]:flex [&_li]:items-center [&_li]:gap-3 [&_li]:before:content-[''] [&_li]:before:w-1 [&_li]:before:h-1 [&_li]:before:bg-outline [&_li]:before:shrink-0"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      </div>
    </div>
  )
}

