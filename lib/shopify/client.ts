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
    // Debug logging (remove in production)
    console.log('[Shopify Debug] Starting Request to Domain:', domain)
    console.log('[Shopify Debug] Token starts with:', token ? token.substring(0, 4) : 'undefined')

    if (!domain || !token) {
      console.error('[Shopify Config Error] Missing ENV variables:', {
        domain: domain ? 'Loaded' : 'Missing',
        token: token ? `Loaded (starts with ${token.substring(0, 4)}...)` : 'Missing',
      })
    }

    const data = await client.request<T>(query, variables)
    return data
  } catch (error: any) {
    console.error('[Shopify API Error Full Log]', JSON.stringify(error, null, 2))

    if (error instanceof ClientError) {
      console.error('[Shopify API ClientError]', {
        query: query.slice(0, 150) + '...',
        variables,
        errors: error.response?.errors,
        status: error.response?.status,
        headers: error.response?.headers,
      })
    } else {
      console.error('[Shopify API Error (Non-ClientError)]', error?.message || error)
    }

    throw new Error('Failed to fetch from Shopify. Please review server logs for details.')
  }
}

