'use client'
// components/product/VariantSelector.tsx
import { useProductVariant } from '@/hooks/useProductVariant'
import AddToCartButton from './AddToCartButton'
import { formatPrice } from '@/lib/currency'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface Props {
  product: ShopifyProduct
  locale: string
}

export default function VariantSelector({ product, locale }: Props) {
  const { selectedOptions, selectedVariant, selectOption } = useProductVariant(product)

  return (
    <div className="flex flex-col gap-10">
      {product.options.map((option) => {
        const isSize = option.name.toLowerCase() === 'size'

        return (
          <div key={option.id}>
            <div className="mb-4 flex items-end justify-between">
              <span className="text-sm font-label text-on-surface-variant uppercase tracking-widest">
                Select {option.name}
              </span>
              {isSize && (
                <button className="text-sm font-body text-on-surface-variant hover:text-on-surface underline flex items-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">straighten</span> Size Guide
                </button>
              )}
            </div>

            <div className={isSize ? "grid grid-cols-5 gap-3" : "flex gap-4"}>
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value

                // Check whether this value is available in any variant
                const available = product.variants.nodes.some(
                  (v) =>
                    v.selectedOptions.some((o) => o.name === option.name && o.value === value) &&
                    v.availableForSale
                )

                if (!isSize) {
                  // Color Selector
                  return (
                    <button
                      key={value}
                      onClick={() => selectOption(option.name, value)}
                      disabled={!available}
                      title={value}
                      className={`w-10 h-10 rounded-full transition-colors relative border ${isSelected
                          ? 'border-transparent before:absolute before:inset-[-4px] before:rounded-full before:border-2 before:border-outline-variant/50 shadow-md ring-1 ring-primary'
                          : 'border-outline-variant/20 hover:border-outline-variant/50'
                        }`}
                      style={{ backgroundColor: value.toLowerCase() === 'white' ? '#fff' : value.toLowerCase() === 'black' ? '#111' : '#ccc' }}
                    >
                      <span className="sr-only">{value}</span>
                    </button>
                  )
                }

                // Size Selector
                return (
                  <button
                    key={value}
                    onClick={() => selectOption(option.name, value)}
                    disabled={!available}
                    className={`py-3 rounded-md font-body text-sm transition-colors ${isSelected
                        ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(45,52,53,0.1)]'
                        : available
                          ? 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary'
                          : 'bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed line-through'
                      }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="mt-4">
        <AddToCartButton variant={selectedVariant} />
      </div>
    </div>
  )
}
