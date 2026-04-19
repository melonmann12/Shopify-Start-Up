// lib/shopify/queries/cart.ts

export const CART_LINE_FRAGMENT = `
  fragment CartLineFragment on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
        product { title handle images(first: 1) { nodes { url altText } } }
      }
    }
  }
`

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      totalQuantity
      checkoutUrl
      lines(first: 50) { nodes { ...CartLineFragment } }
      cost { subtotalAmount { amount currencyCode } }
    }
  }
  ${CART_LINE_FRAGMENT}
`
