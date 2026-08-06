import type { JudgeMeReviewsResult } from './api';

export interface ProductReview {
  id: string;
  reviewerName: string;
  rating: number; // out of 5
  title: string;
  body: string;
  selectedSize?: string;
  selectedShape?: string;
  createdAt: string; // ISO date string
  verified: boolean;
  source: 'judgeme' | 'sample';
}

/**
 * Maps raw Judge.me JSON payload into our stable ProductReview UI format.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptJudgeMeReviews(data: any): JudgeMeReviewsResult {
  // If the data is empty or structurally invalid
  if (!data || typeof data !== 'object') {
    return { reviews: [], averageRating: 0, reviewCount: 0 };
  }

  // The specific structure depends on the API endpoint used.
  // In the Widget API json_request, it might return { html: ... } or an array of reviews.
  // We handle a standard REST array of reviews as well as nested objects.
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawReviews: any[] = Array.isArray(data.reviews) ? data.reviews : Array.isArray(data) ? data : [];
  
  const reviews: ProductReview[] = rawReviews.map((r) => ({
    id: `judgeme-${r.id ? String(r.id) : Math.random().toString(36).substring(7)}`,
    reviewerName: r.reviewer?.name || r.name || 'Anonymous',
    rating: Number(r.rating) || 5,
    title: r.title || '',
    body: r.body || '',
    createdAt: r.created_at || r.updated_at || new Date().toISOString(),
    verified: Boolean(r.verified || r.verified_buyer),
    source: 'judgeme',
    // Judge.me custom fields might contain size/shape depending on how they were configured
    selectedSize: r.custom_fields?.Size || undefined,
    selectedShape: r.custom_fields?.Shape || undefined,
  }));

  const totalReviews = reviews.length;
  
  // Calculate average safely
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews).toFixed(1))
    : 0;

  return {
    reviews,
    averageRating,
    reviewCount: totalReviews,
  };
}
