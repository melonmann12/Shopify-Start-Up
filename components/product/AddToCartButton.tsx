'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { createBuyNowCartAction } from '@/lib/actions/cart'
import { addToCart as trackAddToCart } from '@/lib/analytics/metaPixel'
import type { ShopifyProductVariant } from '@/lib/shopify/types'

interface Props {
  variant?: ShopifyProductVariant
  productTitle: string
  attributes?: { key: string; value: string }[]
  /** Return an error string to block add-to-cart, or null to allow */
  onValidate?: () => string | null
}

export default function AddToCartButton({ variant, productTitle, attributes, onValidate }: Props) {
  const { addToCart } = useCart()
  const [isAddingToBag, setIsAddingToBag] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)

  const isAvailable = variant?.availableForSale

  useEffect(() => {
    const resetLoadingState = () => {
      setIsBuyingNow(false)
      setIsAddingToBag(false)
    }

    window.addEventListener('pageshow', resetLoadingState)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resetLoadingState()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pageshow', resetLoadingState)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleAdd = async () => {
    if (onValidate) {
      const error = onValidate()
      if (error) return // validation failed — parent handles the message
    }
    if (variant) {
      setIsAddingToBag(true)
      await addToCart(variant.id, 1, attributes)
      
      // Fire Meta Pixel tracking *after* successful cart addition
      trackAddToCart(
        variant.id,
        productTitle,
        Number(variant.price.amount),
        1
      )

      setIsAddingToBag(false)
    }
  }

  const handleBuyNow = async () => {
    if (onValidate) {
      const error = onValidate()
      if (error) return
    }
    if (variant) {
      setIsBuyingNow(true)
      try {
        const temporaryCart = await createBuyNowCartAction(variant.id, 1, attributes)
        
        // Fire Meta Pixel tracking *after* successful cart creation, before redirect
        trackAddToCart(
          variant.id,
          productTitle,
          Number(variant.price.amount),
          1
        )

        if (temporaryCart?.checkoutUrl) {
          window.location.href = temporaryCart.checkoutUrl
        } else {
          setIsBuyingNow(false)
          console.error("No checkout URL returned from temporary cart.")
        }
      } catch (error) {
        setIsBuyingNow(false)
        console.error("Failed to create Buy Now checkout", error)
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 mb-16 mt-4">
      <button
        onClick={handleAdd}
        disabled={!variant || !isAvailable || isAddingToBag || isBuyingNow}
        className={`w-full py-5 border transition-colors duration-300 ${!variant || !isAvailable ? 'cursor-not-allowed border-outline/25 bg-transparent text-on-surface-variant/40' : 'border-on-background bg-surface-container-lowest text-on-background hover:bg-on-background hover:text-surface-container-lowest' } text-label`}
      >
        {isAddingToBag ? 'ADDING...' : (!variant ? 'SELECT SIZE' : !isAvailable ? 'OUT OF STOCK' : 'ADD TO BAG')}
      </button>

      <button
        onClick={handleBuyNow}
        disabled={!variant || !isAvailable || isAddingToBag || isBuyingNow}
        className={`w-full py-5 border transition-colors duration-300 ${!variant || !isAvailable ? 'cursor-not-allowed border-outline/25 bg-transparent text-on-surface-variant/40' : 'border-on-background bg-on-background text-surface-container-lowest hover:bg-on-background/90' } text-label`}
      >
        {isBuyingNow ? 'PROCESSING...' : 'BUY NOW'}
      </button>
    </div>
  )
}
