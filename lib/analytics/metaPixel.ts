declare global {
  interface Window {
    fbq: any
    _fbq: any
  }
}

export const PIXEL_ID = '992917046910408'

const ensureFbq = () => {
  if (typeof window === 'undefined') return
  if (!window.fbq) {
    window.fbq = function () {
      if (window.fbq.callMethod) {
        window.fbq.callMethod.apply(window.fbq, arguments)
      } else {
        window.fbq.queue.push(arguments)
      }
    }
    window.fbq.push = window.fbq
    window.fbq.loaded = true
    window.fbq.version = '2.0'
    window.fbq.queue = []
  }
}

const getNumericId = (gid: string) => {
  return gid.split('/').pop() || gid
}

export const pageview = () => {
  if (typeof window !== 'undefined') {
    ensureFbq()
    window.fbq('track', 'PageView', { event_source_url: window.location.href })
  }
}

export const viewContent = (
  variantId: string,
  title: string,
  price: number,
  currency: string = 'USD'
) => {
  if (typeof window !== 'undefined') {
    ensureFbq()
    window.fbq('track', 'ViewContent', {
      content_ids: [getNumericId(variantId)],
      content_type: 'product',
      content_name: title,
      value: price,
      currency: currency,
      event_source_url: window.location.href
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
  if (typeof window !== 'undefined') {
    ensureFbq()
    window.fbq('track', 'AddToCart', {
      content_ids: [getNumericId(variantId)],
      content_type: 'product',
      content_name: title,
      value: price,
      currency: currency,
      quantity: quantity,
      event_source_url: window.location.href
    })
  }
}
