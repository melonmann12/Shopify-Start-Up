export const GET_SHOP_POLICIES = `
  query getShopPolicies {
    shop {
      privacyPolicy {
        id
        title
        body
      }
      shippingPolicy {
        id
        title
        body
      }
      termsOfService {
        id
        title
        body
      }
      refundPolicy {
        id
        title
        body
      }
    }
  }
`
