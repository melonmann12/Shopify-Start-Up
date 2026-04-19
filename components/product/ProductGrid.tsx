import ProductCard from './ProductCard'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  products: ShopifyProduct[]
  locale: string
}

export default function ProductGrid({ products, locale }: Props) {
  if (products.length === 0) {
    return (
      <section className="max-w-[1920px] mx-auto px-8 md:px-16 py-32 flex flex-col items-center justify-center text-center h-[512px]">
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-on-surface mb-8 tracking-tight">Our objects are coming soon.</h2>
      </section>
    )
  }

  return (
    <section className="max-w-[1920px] mx-auto px-8 md:px-16 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            locale={locale} 
            isPriority={index < 4}
          />
        ))}
      </div>
    </section>
  )
}
