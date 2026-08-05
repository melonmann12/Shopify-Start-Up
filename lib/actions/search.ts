'use server'

import { shopifyFetch } from '@/lib/shopify/client'
import { PREDICTIVE_SEARCH } from '@/lib/shopify/queries/search'
import { countryMap, type Locale } from '@/lib/i18n/config'

export interface PredictiveSearchResult {
  products: {
    id: string
    title: string
    handle: string
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
    images: { nodes: { url: string; altText: string | null; width: number; height: number }[] }
  }[]
  collections: {
    id: string
    title: string
    handle: string
  }[]
}

interface PredictiveSearchResponse {
  predictiveSearch: PredictiveSearchResult
}

export async function getPredictiveSearch(query: string, locale: string): Promise<PredictiveSearchResult> {
  if (!query || query.trim().length === 0) {
    return { products: [], collections: [] }
  }
  
  const l = locale as Locale
  const country = countryMap[l] ?? 'US'
  const language = l.toUpperCase()
  
  try {
    const data = await shopifyFetch<PredictiveSearchResponse>(PREDICTIVE_SEARCH, {
      query,
      country,
      language,
    })
    
    // Limit to a small amount of results to keep it lightweight
    return {
      products: data?.predictiveSearch?.products?.slice(0, 5) || [],
      collections: data?.predictiveSearch?.collections?.slice(0, 4) || [],
    }
  } catch (error) {
    console.error('[Predictive Search Error]', error)
    return { products: [], collections: [] }
  }
}
