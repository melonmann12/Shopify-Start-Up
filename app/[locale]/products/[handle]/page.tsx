// app/[locale]/products/[handle]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/shopify/queries/product'
import { countryMap, type Locale } from '@/lib/i18n/config'
import ProductClient from '@/components/product/ProductClient'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify/types'

export const revalidate = 3600

interface Props {
  params: Promise<{ handle: string; locale: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const locale = params.locale as Locale
  let data: { product: ShopifyProduct | null } | null = null
  try {
    data = await shopifyFetch<{ product: ShopifyProduct | null }>(
      GET_PRODUCT_BY_HANDLE,
      { handle: params.handle, country: countryMap[locale] ?? 'US', language: locale.toUpperCase() }
    )
  } catch {
    return { title: 'Product | Nailestial' }
  }

  const product = data?.product
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
      canonical: `/en/products/${params.handle}`,
      languages: {
        vi: `/vi/products/${params.handle}`,
        en: `/en/products/${params.handle}`,
      },
    },
  }
}

export default async function ProductDetailPage(props: Props) {
  const params = await props.params
  const locale = params.locale as Locale
  const country = countryMap[locale] ?? 'US'
  const language = locale.toUpperCase()

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
    GET_PRODUCT_BY_HANDLE,
    { handle: params.handle, country, language }
  )

  if (!data.product) notFound()

  const product = data.product

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
      <ProductClient product={product} locale={locale} />
    </main>
  )
}

