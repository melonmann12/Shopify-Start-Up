// lib/shopify/mutations/cart.ts
import { CART_LINE_FRAGMENT } from '../queries/cart'

export const CREATE_CART = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        totalQuantity
        checkoutUrl
        lines(first: 50) { nodes { ...CartLineFragment } }
        cost { subtotalAmount { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
  ${CART_LINE_FRAGMENT}
`

export const ADD_TO_CART = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
        checkoutUrl
        lines(first: 50) { nodes { ...CartLineFragment } }
        cost { subtotalAmount { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
  ${CART_LINE_FRAGMENT}
`

export const UPDATE_CART_LINE = `
  mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
        lines(first: 50) { nodes { ...CartLineFragment } }
        cost { subtotalAmount { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
  ${CART_LINE_FRAGMENT}
`

export const REMOVE_FROM_CART = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
        lines(first: 50) { nodes { ...CartLineFragment } }
        cost { subtotalAmount { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
  ${CART_LINE_FRAGMENT}
`
