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

  // Lấy badge từ metafield (Ví dụ: NEW, POPULAR, SALE 25%)
  const badge = product.metafields?.find(
    (m) => m?.namespace === 'custom' && m?.key === 'badge_label'
  )?.value || 'NEW' // Để tạm 'NEW' nếu chưa có data để test UI

  // Lấy một đoạn mô tả ngắn (có thể cấu hình trong phần SEO description của Shopify)
  const shortDesc = product.seo?.description || "A REFINED GESTURE FOR ENHANCING ANY MOMENT."

  return (
    <Link
      href={`/${locale}/products/${product.handle}`}
      // Box thẻ nền trắng, padding vừa phải, viền mỏng
      className="bg-white border border-outline-variant/20 shadow-sm p-6 flex flex-col group h-full hover:shadow-md transition-all duration-500 rounded-none"
    >

      {/* 1. KHU VỰC THUỘC TÍNH (Ở TRÊN CÙNG) */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Ô Tag (Boxed) */}
        {badge && (
          <div className="border border-outline-variant/40 px-2 py-1 self-start">
            <span className="text-on-background text-label">
              {badge}
            </span>
          </div>
        )}

        {/* Các dòng text thuộc tính (Subtitle & Description) */}
        <div className="flex flex-col gap-1">
          <p className="text-on-background font-bold text-label">
            {'nailestial'}
          </p>
          <p className="text-on-surface-variant line-clamp-2 text-label">
            {shortDesc}
          </p>
        </div>
      </div>

      {/* 2. KHU VỰC HÌNH ẢNH */}
      <div className="w-full aspect-[4/3] bg-transparent overflow-hidden relative mb-6">
        {image && (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            priority={isPriority}
            loading={isPriority ? "eager" : undefined}
            // Ảnh contain gọn gàng, không bị cắt
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out p-2"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
      </div>

      {/* 3. KHU VỰC TÊN & NÚT (Ở DƯỚI CÙNG) */}
      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-serif text-2xl font-normal text-on-background leading-tight">
            {product.title}
          </h3>
          {/* Vẫn giữ giá trị cốt lõi là hiện giá tiền */}
          <p className="text-on-surface-variant text-label">
            {formatPrice(price.amount, price.currencyCode, locale)}
          </p>
        </div>

        <div className="text-on-background group-hover:opacity-50 transition-opacity duration-300 mt-2 text-label">
          Purchase
        </div>
      </div>
    </Link>
  )
}