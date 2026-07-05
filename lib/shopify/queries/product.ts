// lib/shopify/queries/product.ts

export const GET_PRODUCT_BY_HANDLE = `
  query GetProduct($handle: String!, $country: CountryCode!, $language: LanguageCode!)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      metafields(identifiers: [
        { namespace: "custom", key: "badge_label" },
        { namespace: "custom", key: "size_guide_url" }
      ]) {
        namespace
        key
        value
      }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      images(first: 10) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      options {
        id
        name
        values
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText width height }
        }
      }
      seo { title description }
    }
  }
`

export const GET_PRODUCTS = `
  query GetProducts(
    $first: Int!,
    $after: String,
    $query: String,
    $sortKey: ProductSortKeys,
    $reverse: Boolean,
    $country: CountryCode!,
    $language: LanguageCode!
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      after: $after,
      query: $query,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        title
        handle
        vendor
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 2) {
          nodes { url altText width height }
        }
        variants(first: 1) {
          nodes { availableForSale }
        }
        metafields(identifiers: [{ namespace: "custom", key: "badge_label" }]) {
          value
        }
      }
    }
  }
`
