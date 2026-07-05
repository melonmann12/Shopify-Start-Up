// lib/shopify/client.ts
import { GraphQLClient, ClientError } from 'graphql-request'

const apiVersion = '2024-10'

// Lazily create a client on each request so that Server Actions (which have
// their own module evaluation scope) always read process.env at runtime.
function createShopifyClient() {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    ''
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''

  return new GraphQLClient(
    `https://${domain}/api/${apiVersion}/graphql.json`,
    {
      headers: {
        'X-Shopify-Storefront-Access-Token': token,
        'Content-Type': 'application/json',
      },
    }
  )
}

// Keep named export for any direct consumers
export const shopifyClient = createShopifyClient()

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  // Build a fresh client so Server Actions always get correct env values
  const client = createShopifyClient()

  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    ''
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''

  try {
    // 1. Strict sanitation: Ensure if context is missing or corrupted by static file routing (e.g. "ROBOTS.TXT"), it safely defaults to "EN" or "VI".
    if (variables.language) {
      const lang = String(variables.language).toUpperCase()
      if (lang !== 'EN' && lang !== 'VI') {
        variables.language = 'EN' // Safe fallback
      }
    }

    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Shopify Debug] Starting Request to Domain:', domain)
      console.log('[Shopify Debug] Token starts with:', token ? token.substring(0, 4) : 'undefined')
    }

    if (!domain || !token) {
      console.error('[Shopify Config Error] Missing ENV variables:', {
        domain: domain ? 'Loaded' : 'Missing',
        token: token ? `Loaded (starts with ${token.substring(0, 4)}...)` : 'Missing',
      })
    }

    // Use rawRequest so we can access both data AND errors simultaneously.
    // graphql-request's default client.request() throws whenever errors[] is
    // present, even when response.data is fully populated (Shopify partial errors
    // for fields like quantityAvailable or non-existent metafields). rawRequest
    // lets us decide: if we got valid data, use it; only throw if data is absent.
    const { data, errors, status } = await client.rawRequest<T>(query, variables)

    if (errors && errors.length > 0) {
      if (status === 401) {
        // Real authorization failure — always throw.
        throw new Error('[Shopify API] Unauthorized (401). Check your Storefront Access Token.')
      }
      // Partial errors: log them for visibility but don't discard valid data.
      console.warn(
        '[Shopify API Partial Errors] GraphQL returned errors alongside data.',
        errors.map((e: { message: string; locations?: unknown; path?: unknown }) => ({
          message: e.message,
          path: e.path,
        }))
      )
    }

    if (!data) {
      throw new Error('[Shopify API] Response contained no data.')
    }

    return data
  } catch (error: any) {
    // Re-throw errors we intentionally threw above.
    if (error?.message?.startsWith('[Shopify API]')) throw error

    console.error('[Shopify API Error Full Log]', JSON.stringify(error, null, 2))

    if (error instanceof ClientError) {
      console.error('[Shopify API ClientError]', {
        query: query.slice(0, 150) + '...',
        variables,
        errors: error.response?.errors,
        status: error.response?.status,
      })
    } else {
      console.error('[Shopify API Error (Non-ClientError)]', error?.message || error)
    }

    throw new Error('Failed to fetch from Shopify. Please review server logs for details.')
  }
}

