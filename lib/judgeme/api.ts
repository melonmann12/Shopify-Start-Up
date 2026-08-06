import type { ProductReview } from './adapter';
import { adaptJudgeMeReviews } from './adapter';

export interface JudgeMeReviewsResult {
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
}

/**
 * Safely fetches reviews from Judge.me API for a specific Shopify product using the private REST API.
 * Returns empty data gracefully on failure or if the API token is missing.
 */
export async function getProductReviews(shopifyProductId: string): Promise<JudgeMeReviewsResult> {
  const shopDomain = process.env.JUDGEME_SHOP_DOMAIN;
  const privateToken = process.env.JUDGEME_PRIVATE_TOKEN;

  const defaultEmptyResult: JudgeMeReviewsResult = {
    reviews: [],
    averageRating: 0,
    reviewCount: 0,
  };

  if (!shopDomain || !privateToken) {
    console.warn('[Judge.me] Missing JUDGEME_SHOP_DOMAIN or JUDGEME_PRIVATE_TOKEN. Skipping reviews fetch.');
    return defaultEmptyResult;
  }

  try {
    // Extract the raw numeric ID if passed a GID
    const numericId = shopifyProductId.includes('gid://') 
      ? shopifyProductId.split('/').pop() 
      : shopifyProductId;

    if (!numericId) return defaultEmptyResult;

    // Step 1: Resolve the Judge.me internal product ID
    const productUrl = new URL('https://api.judge.me/api/v1/products/-1');
    productUrl.searchParams.set('api_token', privateToken);
    productUrl.searchParams.set('shop_domain', shopDomain);
    productUrl.searchParams.set('external_id', numericId);

    const productResponse = await fetch(productUrl.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!productResponse.ok) {
      if (productResponse.status === 404) {
        // Product doesn't exist in Judge.me yet, meaning no reviews.
        return defaultEmptyResult;
      }
      console.warn(`[Judge.me] Product lookup failed: ${productResponse.status} ${productResponse.statusText}`);
      return defaultEmptyResult;
    }

    const productData = await productResponse.json();
    const internalProductId = productData.product?.id;

    if (!internalProductId) {
      console.warn(`[Judge.me] No internal product ID found for external_id ${numericId}`);
      return defaultEmptyResult;
    }

    // Step 2: Fetch published reviews using the internal product ID
    const reviewsUrl = new URL('https://api.judge.me/api/v1/reviews');
    reviewsUrl.searchParams.set('api_token', privateToken);
    reviewsUrl.searchParams.set('shop_domain', shopDomain);
    reviewsUrl.searchParams.set('product_id', String(internalProductId));
    reviewsUrl.searchParams.set('published', 'true');
    reviewsUrl.searchParams.set('per_page', '100');

    const reviewsResponse = await fetch(reviewsUrl.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!reviewsResponse.ok) {
      console.warn(`[Judge.me] Failed to fetch reviews: ${reviewsResponse.status} ${reviewsResponse.statusText}`);
      return defaultEmptyResult;
    }

    const reviewsData = await reviewsResponse.json();
    
    return adaptJudgeMeReviews(reviewsData);
    
  } catch (error) {
    console.warn('[Judge.me] Error fetching reviews:', error);
    return defaultEmptyResult;
  }
}
