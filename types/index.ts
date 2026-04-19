// types/index.ts

/** Re-export Shopify types for convenience */
export type {
  ShopifyProduct,
  ShopifyProductVariant,
  ShopifyProductOption,
  ShopifyCart,
  ShopifyCartLine,
  Money,
  ShopifyImage,
  ShopifyMetafield,
} from '@/lib/shopify/types'

/** Page params helper */
export interface PageParams {
  params: {
    locale: string
    handle?: string
  }
  searchParams?: Record<string, string | string[] | undefined>
}
