// hooks/useCart.ts
'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { addToCartAction, updateLineQuantityAction, removeLineAction, getCartAction } from '@/lib/actions/cart'

export function useCart() {
  const { cartId, cart, isOpen, setCart, setCartId, openCart, closeCart } =
    useCartStore()

  // Always use cart.id as authoritative — never the stale persisted cartId
  const activeCartId = cart?.id ?? cartId

  // Hydrate on mount if we have a persisted cartId but no cart object yet
  useEffect(() => {
    if (cartId && !cart) {
      getCartAction(cartId).then((fetchedCart) => {
        if (fetchedCart) {
          setCart(fetchedCart)
          // Sync persisted ID to the live cart ID to prevent future drift
          if (fetchedCart.id !== cartId) setCartId(fetchedCart.id)
        }
      }).catch(console.error)
    }
  }, [cartId, cart, setCart, setCartId])

  async function addToCart(variantId: string, quantity = 1) {
    try {
      const newCart = await addToCartAction(activeCartId, variantId, quantity)
      if (newCart) {
        setCart(newCart)
        if (!cartId) setCartId(newCart.id)
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  async function updateLineQuantity(lineId: string, quantity: number) {
    if (!activeCartId) return
    try {
      const newCart = await updateLineQuantityAction(activeCartId, lineId, quantity)
      if (newCart) setCart(newCart)
    } catch (error) {
      console.error('Failed to update cart line:', error)
    }
  }

  async function removeLine(lineId: string) {
    if (!activeCartId) return
    try {
      const newCart = await removeLineAction(activeCartId, lineId)
      if (newCart) setCart(newCart)
    } catch (error) {
      console.error('Failed to remove cart line:', error)
    }
  }

  const itemCount = cart?.totalQuantity ?? 0

  return {
    cart,
    cartId: activeCartId,
    isOpen,
    itemCount,
    openCart,
    closeCart,
    addToCart,
    updateLineQuantity,
    removeLine,
  }
}
