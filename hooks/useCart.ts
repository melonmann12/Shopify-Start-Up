// hooks/useCart.ts
'use client'

import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/store/cart'
import { addToCartAction, updateLineQuantityAction, removeLineAction, getCartAction } from '@/lib/actions/cart'
import type { ShopifyCart } from '@/lib/shopify/types'

export function useCart() {
  const { cartId, cart, isOpen, setCart, setCartId, openCart, closeCart } =
    useCartStore()

  // Track in-flight mutation count so CartDrawer can disable Checkout while busy
  const pendingRef = useRef(0)
  const [isPending, setIsPending] = useState(false)

  function beginMutation() {
    pendingRef.current += 1
    setIsPending(true)
  }
  function endMutation() {
    pendingRef.current = Math.max(0, pendingRef.current - 1)
    if (pendingRef.current === 0) setIsPending(false)
  }

  // Derived for read-only display (do NOT use this inside async functions — it can be stale)
  const activeCartId = cart?.id ?? cartId

  // Helper: read the freshest cartId at call time, bypassing any closure staleness.
  // useCartStore.getState() reads directly from the Zustand store without waiting for a re-render.
  function getCurrentCartId(): string | null {
    const state = useCartStore.getState()
    return state.cart?.id ?? state.cartId
  }

  // Defensive merge: if Shopify returns a cart without checkoutUrl (e.g. a mutation
  // that omits the field), preserve the last known good URL from the current store
  // rather than overwriting it with undefined.
  function mergeCart(newCart: ShopifyCart) {
    const currentCheckoutUrl = useCartStore.getState().cart?.checkoutUrl
    setCart({
      ...newCart,
      checkoutUrl: newCart.checkoutUrl || currentCheckoutUrl || '',
    })
  }

  // Hydrate on mount if we have a persisted cartId but no cart object yet
  useEffect(() => {
    if (cartId && !cart) {
      getCartAction(cartId).then((fetchedCart) => {
        if (fetchedCart) {
          mergeCart(fetchedCart)
          // Always sync persisted cartId with whatever Shopify returned
          if (fetchedCart.id !== cartId) setCartId(fetchedCart.id)
        }
      }).catch(console.error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId, cart, setCartId])

  async function addToCart(variantId: string, quantity = 1, attributes?: { key: string; value: string }[]) {
    // Read the live cart ID at call time — never use the closure-captured activeCartId
    const liveCartId = getCurrentCartId()
    beginMutation()
    try {
      const newCart = await addToCartAction(liveCartId, variantId, quantity, attributes)
      if (newCart) {
        mergeCart(newCart)
        // ALWAYS sync cartId — Shopify may return a cart with a different ID
        setCartId(newCart.id)
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      endMutation()
    }
  }

  async function updateLineQuantity(lineId: string, quantity: number) {
    const liveCartId = getCurrentCartId()
    if (!liveCartId) return
    beginMutation()
    try {
      const newCart = await updateLineQuantityAction(liveCartId, lineId, quantity)
      if (newCart) {
        mergeCart(newCart)
        if (newCart.id !== liveCartId) setCartId(newCart.id)
      }
    } catch (error) {
      console.error('Failed to update cart line:', error)
    } finally {
      endMutation()
    }
  }

  async function removeLine(lineId: string) {
    const liveCartId = getCurrentCartId()
    if (!liveCartId) return
    beginMutation()
    try {
      const newCart = await removeLineAction(liveCartId, lineId)
      if (newCart) {
        mergeCart(newCart)
        if (newCart.id !== liveCartId) setCartId(newCart.id)
      }
    } catch (error) {
      console.error('Failed to remove cart line:', error)
    } finally {
      endMutation()
    }
  }

  const itemCount = cart?.totalQuantity ?? 0

  return {
    cart,
    cartId: activeCartId,
    isOpen,
    isPending,
    itemCount,
    openCart,
    closeCart,
    addToCart,
    updateLineQuantity,
    removeLine,
  }
}


