// components/product/ProductGrid.tsx
import ProductCard from './ProductCard'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  products: ShopifyProduct[]
  locale: string
}

export default function ProductGrid({ products, locale }: Props) {
  if (products.length === 0) {
    return <p className="text-brand-muted">No products found.</p>
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} locale={locale} />
        </li>
      ))}
    </ul>
  )
}
