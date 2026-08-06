'use client'

import Image, { ImageProps } from 'next/image'
import shopifyLoader from '@/lib/shopify/image-loader'

export default function ShopifyImage(props: ImageProps) {
  return <Image {...props} loader={shopifyLoader} />
}
