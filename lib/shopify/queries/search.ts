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
