export const GET_UGC_ITEMS = `
  query getUgcItems($language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    metaobjects(type: "ugc_item", first: 100) {
      nodes {
        id
        filename: field(key: "filename") {
          value
        }
        sortOrder: field(key: "sort_order") {
          value
        }
        active: field(key: "active") {
          value
        }
        altText: field(key: "alt_text") {
          value
        }
        productField: field(key: "product") {
          reference {
            ... on Product {
              id
              title
              handle
              availableForSale
            }
          }
        }
      }
    }
  }
`
