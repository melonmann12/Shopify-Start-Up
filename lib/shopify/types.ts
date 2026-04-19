// lib/shopify/types.ts

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  metafields: ShopifyMetafield[]
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money }
  images: { nodes: ShopifyImage[] }
  options: ShopifyProductOption[]
  variants: { nodes: ShopifyProductVariant[] }
  seo: { title: string; description: string }
}

export interface ShopifyProductVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number
  selectedOptions: { name: string; value: string }[]
  price: Money
  compareAtPrice: Money | null
  image: ShopifyImage | null
}

export interface ShopifyProductOption {
  id: string
  name: string
  values: string[]
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: { nodes: ShopifyCartLine[] }
  cost: { subtotalAmount: Money }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: ShopifyProductVariant & {
    product: Pick<ShopifyProduct, 'title' | 'handle' | 'images'>
  }
}

export interface Money {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyMetafield {
  namespace: string
  key: string
  value: string
}
