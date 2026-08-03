declare global {
  interface Window {
    fbq: any
    _fbq: any
  }
}

export const PIXEL_ID = '992917046910408'

export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

export const viewContent = (
  variantId: string,
  title: string,
  price: number,
  currency: string = 'USD'
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [variantId],
      content_type: 'product',
      content_name: title,
      value: price,
      currency: currency,
    })
  }
}

export const addToCart = (
  variantId: string,
  title: string,
  price: number,
  quantity: number = 1,
  currency: string = 'USD'
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [variantId],
      content_type: 'product',
      content_name: title,
      value: price,
      currency: currency,
      quantity: quantity,
    })
  }
}
