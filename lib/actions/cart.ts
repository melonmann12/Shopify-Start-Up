'use server'

import { shopifyFetch } from '@/lib/shopify/client'
import { CREATE_CART, ADD_TO_CART, UPDATE_CART_LINE, REMOVE_FROM_CART } from '@/lib/shopify/mutations/cart'
import { GET_CART } from '@/lib/shopify/queries/cart'
import type { ShopifyCart } from '@/lib/shopify/types'
import { revalidateTag } from 'next/cache'

export async function getCartAction(cartId: string) {
  const data: { cart: ShopifyCart } = await (shopifyFetch as any)(
    GET_CART,
    { cartId }
  )
  return data.cart
}

export async function addToCartAction(cartId: string | null, variantId: string, quantity: number) {
  let cart: ShopifyCart

  if (cartId) {
    const data: { cartLinesAdd: { cart: ShopifyCart } } = await (shopifyFetch as any)(
      ADD_TO_CART,
      { cartId, lines: [{ merchandiseId: variantId, quantity }] }
    )
    cart = data.cartLinesAdd.cart
  } else {
    const data: { cartCreate: { cart: ShopifyCart } } = await (shopifyFetch as any)(
      CREATE_CART,
      { input: { lines: [{ merchandiseId: variantId, quantity }] } }
    )
    cart = data.cartCreate.cart
  }

  (revalidateTag as any)('cart')
  return cart
}

export async function updateLineQuantityAction(cartId: string, lineId: string, quantity: number) {
  const safeQuantity = Math.max(1, Math.floor(quantity))

  const data: { cartLinesUpdate: { cart: ShopifyCart } } = await (shopifyFetch as any)(
    UPDATE_CART_LINE,
    { cartId, lines: [{ id: lineId, quantity: safeQuantity }] }
  )
  (revalidateTag as any)('cart')
  return data.cartLinesUpdate.cart
}

export async function removeLineAction(cartId: string, lineId: string) {
  const data: { cartLinesRemove: { cart: ShopifyCart } } = await (shopifyFetch as any)(
    REMOVE_FROM_CART,
    { cartId, lineIds: [lineId] }
  )
  (revalidateTag as any)('cart')
  return data.cartLinesRemove.cart
}
