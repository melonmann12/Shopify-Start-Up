// lib/shopify/queries/collection.ts

export const GET_COLLECTION = `
  query GetCollection(
    $handle: String!,
    $first: Int!,
    $country: CountryCode!,
    $language: LanguageCode!,
    $sortKey: ProductCollectionSortKeys,
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      image { url altText }
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        nodes {
          id title handle vendor
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 2) { nodes { url altText width height } }
        }
      }
    }
  }
`

export const GET_COLLECTIONS = `
  query GetCollections($first: Int!, $country: CountryCode!, $language: LanguageCode!)
  @inContext(country: $country, language: $language) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        image { url altText }
      }
    }
  }
`
