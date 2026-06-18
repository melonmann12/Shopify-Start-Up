'use client'

import { useCart } from '@/hooks/useCart'
import type { ShopifyProductVariant } from '@/lib/shopify/types'

interface Props {
  variant?: ShopifyProductVariant
}

export default function AddToCartButton({ variant }: Props) {
  const { addToCart } = useCart()

  const isAvailable = variant?.availableForSale

  return (
    <div className="flex flex-col gap-4 mb-16 mt-4">
      <button
        onClick={() => {
          if (variant) {
            addToCart(variant.id, 1)
          }
        }}
        disabled={!variant || !isAvailable}
        className={`w-full py-5 border font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${!variant || !isAvailable
          ? 'cursor-not-allowed border-outline/25 bg-transparent text-on-surface-variant/40'
          : 'border-on-background bg-surface-container-lowest text-on-background hover:bg-on-background hover:text-surface-container-lowest'
          }`}
      >
        {!variant
          ? 'SELECT SIZE'
          : !isAvailable
            ? 'OUT OF STOCK'
            : 'ADD TO BAG'}
      </button>

      <button className="w-full py-5 border border-outline/40 bg-transparent text-on-surface-variant font-mono text-[11px] uppercase tracking-[0.2em] hover:border-on-background hover:text-on-background transition-colors duration-300">
        FAVOURITE
      </button>
    </div>
  )
}
