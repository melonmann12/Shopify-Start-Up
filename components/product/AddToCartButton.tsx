'use client'

import { useCart } from '@/hooks/useCart'
import type { ShopifyProductVariant } from '@/lib/shopify/types'

interface Props {
  variant?: ShopifyProductVariant
  attributes?: { key: string; value: string }[]
  /** Return an error string to block add-to-cart, or null to allow */
  onValidate?: () => string | null
}

export default function AddToCartButton({ variant, attributes, onValidate }: Props) {
  const { addToCart } = useCart()

  const isAvailable = variant?.availableForSale

  return (
    <div className="flex flex-col gap-4 mb-16 mt-4">
      <button
        onClick={() => {
          if (onValidate) {
            const error = onValidate()
            if (error) return // validation failed — parent handles the message
          }
          if (variant) {
            addToCart(variant.id, 1, attributes)
          }
        }}
        disabled={!variant || !isAvailable}
        className={`w-full py-5 border transition-colors duration-300 ${!variant || !isAvailable ? 'cursor-not-allowed border-outline/25 bg-transparent text-on-surface-variant/40' : 'border-on-background bg-surface-container-lowest text-on-background hover:bg-on-background hover:text-surface-container-lowest' } text-label`}
      >
        {!variant
          ? 'SELECT SIZE'
          : !isAvailable
            ? 'OUT OF STOCK'
            : 'ADD TO BAG'}
      </button>

      <button className="w-full py-5 border border-outline/40 bg-transparent text-on-surface-variant hover:border-on-background hover:text-on-background transition-colors duration-300 text-label">
        FAVOURITE
      </button>
    </div>
  )
}
