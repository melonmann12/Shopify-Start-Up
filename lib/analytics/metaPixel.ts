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

/**
 * Shared helper to convert Shopify GIDs into the exact identifier format 
 * expected by the connected Meta catalog.
 * The connected catalog requires just the numeric Variant ID.
 */
export const formatMetaContentId = (gid: string): string => {
  return gid.split('/').pop() || gid
}

const generateEventId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 15)
}

export const pageview = () => {
  if (typeof window !== 'undefined') {
    ensureFbq()
    const eventId = generateEventId()
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] track PageView:`, { event_source_url: window.location.href, eventId })
    }
    window.fbq('track', 'PageView', { event_source_url: window.location.href }, { eventID: eventId })
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
    const metaId = formatMetaContentId(variantId)
    const eventId = generateEventId()
    
    const payload = {
      content_ids: [metaId],
      content_type: 'product',
      content_name: title,
      value: price,
      currency: currency,
      contents: [{ id: metaId, quantity: 1 }],
      event_source_url: window.location.href
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] track ViewContent:`, { ...payload, eventId })
    }
    window.fbq('track', 'ViewContent', payload, { eventID: eventId })
  }
}

export const addToCart = (
  variantId: string,
  title: string,
  price: number,
  quantity: number = 1,
  currency: string = 'USD',
  event_id?: string
) => {
  if (typeof window !== 'undefined') {
    ensureFbq()
    const metaId = formatMetaContentId(variantId)
    const eventId = event_id || generateEventId()

    const payload = {
      content_ids: [metaId],
      content_type: 'product',
      content_name: title,
      value: price,
      currency: currency,
      quantity: quantity,
      contents: [{ id: metaId, quantity: quantity }],
      event_source_url: window.location.href
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] track AddToCart:`, { ...payload, eventId })
    }
    window.fbq('track', 'AddToCart', payload, { eventID: eventId })
  }
}

export const purchase = (
  orderId: string,
  cartNodes: { variantId: string; title: string; price: number; quantity: number }[],
  currency: string = 'USD'
) => {
  if (typeof window !== 'undefined') {
    ensureFbq()
    // Using orderId as eventID is a best practice for purchase deduplication
    const eventId = orderId || generateEventId()
    
    const content_ids = cartNodes.map(node => formatMetaContentId(node.variantId))
    const contents = cartNodes.map(node => ({
      id: formatMetaContentId(node.variantId),
      quantity: node.quantity
    }))
    const value = cartNodes.reduce((total, node) => total + (node.price * node.quantity), 0)

    const payload = {
      content_ids,
      content_type: 'product',
      contents,
      value,
      currency,
      num_items: cartNodes.reduce((total, node) => total + node.quantity, 0),
      event_source_url: window.location.href
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] track Purchase:`, { ...payload, eventId })
    }
    window.fbq('track', 'Purchase', payload, { eventID: eventId })
  }
}

