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
    <div className="flex flex-col gap-4 mb-12 mt-4">
      <button
        onClick={() => {
          if (variant) {
            addToCart(variant.id, 1)
          }
        }}
        disabled={!variant || !isAvailable}
        className={`w-full py-5 rounded-full font-medium text-base transition-all duration-200 ${!variant || !isAvailable
          ? 'cursor-not-allowed bg-[#f5f5f5] text-[#cccccc]'
          : 'bg-black text-white hover:bg-[#333333] active:scale-[0.98]'
          }`}
      >
        {!variant
          ? 'Select Size'
          : !isAvailable
            ? 'Out of Stock'
            : 'Add to Cart'}
      </button>

      <button className="w-full py-5 rounded-full border border-[#e5e5e5] text-black flex justify-center items-center gap-2 hover:border-black transition-colors duration-200">
        <span className="material-symbols-outlined">favorite</span>
        <span className="font-medium">Favourite</span>
      </button>
    </div>
  )
}
