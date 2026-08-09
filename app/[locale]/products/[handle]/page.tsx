// app/[locale]/products/[handle]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductByHandle } from '@/lib/shopify/queries/product'
import { type Locale } from '@/lib/i18n/config'
import ProductClient from '@/components/product/ProductClient'
import YouMayAlsoLike from '@/components/product/YouMayAlsoLike'
// Temporarily hidden — keep UGC implementation for future re-enable.
// import UgcSocialProof from '@/components/sections/UgcSocialProof'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { getProductReviews } from '@/lib/judgeme/api'

export const revalidate = 3600

interface Props {
  params: Promise<{ handle: string; locale: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const locale = params.locale as Locale
  let product: ShopifyProduct | null = null
  try {
    product = await getProductByHandle(params.handle, locale)
  } catch {
    return { title: 'Product | Nailestial' }
  }

  if (!product) return { title: 'Product | Nailestial' }

  const title = product.seo?.title || `${product.title} | Nailestial`
  const description = product.seo?.description || product.description?.slice(0, 160) || ''
  const imageUrl = product.images?.nodes?.[0]?.url

  return {
    title,
    description,
    openGraph: {
      title: product.title,
      description,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630 }] } : {}),
      type: 'website',
    },
    alternates: {
      canonical: `https://www.nailestial.com/${locale}/products/${params.handle}`,
      languages: {
        vi: `https://www.nailestial.com/vi/products/${params.handle}`,
        en: `https://www.nailestial.com/en/products/${params.handle}`,
      },
    },
  }
}

export default async function ProductDetailPage(props: Props) {
  const params = await props.params
  const locale = params.locale as Locale
  const product = await getProductByHandle(params.handle, locale)

  if (!product) notFound()
  
  // Find the first relevant collection to use for recommendations
  const collections = product.collections?.nodes || []
  const validCollection = collections.find(c => 
    !['all', 'frontpage', 'home-page'].includes(c.handle.toLowerCase())
  )
  const recommendationCollectionHandle = validCollection?.handle || collections[0]?.handle

  // Fetch real reviews from Judge.me
  const { reviews, averageRating, reviewCount } = await getProductReviews(product.id)

  return (
    <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 md:px-[8.333vw] py-12 md:py-20 flex flex-col relative z-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-on-surface-variant mb-10 text-label">
        <ol className="flex items-center space-x-3">
          <li><Link className="hover:text-on-background transition-colors" href={`/${locale}`}>Home</Link></li>
          <li><span className="text-on-surface-variant/50">/</span></li>
          <li><Link className="hover:text-on-background transition-colors" href={`/${locale}/products`}>Products</Link></li>
          <li><span className="text-on-surface-variant/50">/</span></li>
          <li><span className="text-on-surface-variant">{product.title}</span></li>
        </ol>
      </nav>

      {/* Full two-column layout owned by ProductClient (image left, info+options right) */}
      <ProductClient 
        product={product} 
        locale={locale} 
        reviews={reviews}
        averageRating={averageRating}
        reviewCount={reviewCount}
      />

      {/* Cross-Selling Section */}
      <YouMayAlsoLike 
        currentProductId={product.id} 
        locale={locale} 
        collectionHandle={recommendationCollectionHandle}
      />

      {/* Temporarily hidden — keep UGC implementation for future re-enable. */}
      {/* <UgcSocialProof locale={locale} /> */}
    </main>
  )
}

