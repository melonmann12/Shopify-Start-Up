// lib/shopify/queries/search.ts

export const PREDICTIVE_SEARCH = `
  query PredictiveSearch($query: String!, $country: CountryCode!, $language: LanguageCode!)
  @inContext(country: $country, language: $language) {
    predictiveSearch(query: $query, types: [PRODUCT, COLLECTION]) {
      products {
        id
        title
        handle
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 1) { nodes { url altText width height } }
      }
      collections {
        id
        title
        handle
      }
    }
  }
`

export const SEARCH_PRODUCTS = `
  query SearchProducts(
    $query: String!,
    $first: Int!,
    $sortKey: ProductSortKeys,
    $reverse: Boolean,
    $country: CountryCode!,
    $language: LanguageCode!
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      query: $query,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      nodes {
        id
        title
        handle
        vendor
        productType
        tags
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 2) {
          nodes { url altText width height }
        }
        variants(first: 1) {
          nodes { availableForSale }
        }
        collections(first: 10) {
          nodes {
            handle
            title
          }
        }
        metafields(identifiers: [{ namespace: "custom", key: "badge_label" }]) {
          value
        }
      }
    }
  }
`
