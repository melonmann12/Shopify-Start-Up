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
    if (process.env.NODE_ENV === 'development') {
      console.log('[Meta Pixel] Initializing fbq queue and loading fbevents.js...')
    }
    // Official Meta Pixel Snippet (Un-minified for TypeScript)
    const f = window as any
    if (f.fbq) return
    const n: any = f.fbq = function () {
      if (n.callMethod) {
        n.callMethod.apply(n, arguments)
      } else {
        n.queue.push(arguments)
      }
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    
    const t = document.createElement('script')
    t.async = true
    t.src = 'https://connect.facebook.net/en_US/fbevents.js'
    const s = document.getElementsByTagName('script')[0]
    if (s && s.parentNode) {
      s.parentNode.insertBefore(t, s)
    } else {
      document.head.appendChild(t)
    }
    
    window.fbq('init', PIXEL_ID)
  }
}

const getNumericId = (gid: string) => {
  return gid.split('/').pop() || gid
}

export const pageview = () => {
  if (typeof window !== 'undefined') {
    ensureFbq()
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] track PageView:`, window.location.href)
    }
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
    const numericId = getNumericId(variantId)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] track ViewContent:`, { content_ids: [numericId], content_name: title, value: price, event_source_url: window.location.href })
    }
    window.fbq('track', 'ViewContent', {
      content_ids: [numericId],
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
    const numericId = getNumericId(variantId)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] track AddToCart:`, { content_ids: [numericId], content_name: title, value: price })
    }
    window.fbq('track', 'AddToCart', {
      content_ids: [numericId],
      content_type: 'product',
      content_name: title,
      value: price,
      currency: currency,
      quantity: quantity,
      event_source_url: window.location.href
    })
  }
}
