export default function shopifyLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const url = new URL(src)

  // Only apply transformations to Shopify CDN URLs
  if (url.hostname !== 'cdn.shopify.com') {
    return src
  }

  // Shopify CDN uses the 'width' query parameter to resize images on the fly.
  url.searchParams.set('width', width.toString())
  
  if (quality) {
    // Optionally support format conversion or quality if Shopify CDN supports it.
    // However, simply adding width handles the vast majority of the payload size.
  }

  return url.href
}
