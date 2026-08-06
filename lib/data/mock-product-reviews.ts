// lib/data/mock-product-reviews.ts

// TEMPORARY DEMO DATA
// This mock dataset is used for layout and UI purposes only.
// It will be replaced by a real review API integration (e.g. Judge.me, Loox, or Shopify Product Reviews) in the future.
// Do not use this data for JSON-LD structured data or describe it as verified purchases.

export interface ProductReview {
  id: string;
  reviewerName: string;
  rating: number; // out of 5
  title: string;
  body: string;
  selectedSize?: string;
  selectedShape?: string;
  createdAt: string; // ISO date string
}

export const mockProductReviews: ProductReview[] = [
  {
    id: 'rev-001',
    reviewerName: 'S. N.',
    rating: 5,
    title: 'Beautiful and easy to apply',
    body: 'These were surprisingly easy to put on. The color matches the photos well and they look very natural once applied. I’ve worn them for a few days without any lifting.',
    selectedSize: 'Medium',
    selectedShape: 'Almond',
    createdAt: '2023-11-12T08:24:00Z',
  },
  {
    id: 'rev-002',
    reviewerName: 'J. T.',
    rating: 4,
    title: 'Nice everyday set',
    body: 'A great option for everyday wear. They fit nicely after a little bit of filing at the base. The adhesive held up well during normal activities.',
    selectedSize: 'Small',
    selectedShape: 'Square',
    createdAt: '2023-11-05T14:15:00Z',
  },
  {
    id: 'rev-003',
    reviewerName: 'M. L.',
    rating: 5,
    title: 'Very elegant',
    body: 'I bought these for a weekend event and received several compliments. The finish is glossy and feels sturdy, not flimsy like some others I’ve tried.',
    selectedSize: 'Custom',
    selectedShape: 'Almond',
    createdAt: '2023-10-28T09:30:00Z',
  },
  {
    id: 'rev-004',
    reviewerName: 'A. K.',
    rating: 4,
    title: 'Good quality',
    body: 'The quality of the nails is nice and they look like a real manicure. I appreciate the included prep kit, which made the application process much smoother.',
    selectedSize: 'Large',
    selectedShape: 'Coffin',
    createdAt: '2023-10-15T11:20:00Z',
  },
  {
    id: 'rev-005',
    reviewerName: 'E. R.',
    rating: 5,
    title: 'Perfect fit',
    body: 'I struggled finding press-ons that fit my nail beds, but these aligned perfectly. They feel comfortable and secure.',
    selectedSize: 'Medium',
    selectedShape: 'Squoval',
    createdAt: '2023-10-02T16:45:00Z',
  },
  {
    id: 'rev-006',
    reviewerName: 'C. W.',
    rating: 4,
    title: 'Lovely shade',
    body: 'The shade is really pretty in person. They took me about 15 minutes to apply from start to finish. Would definitely repurchase in other colors.',
    selectedSize: 'Medium',
    selectedShape: 'Almond',
    createdAt: '2023-09-20T10:10:00Z',
  },
];

export const mockTotalReviews = mockProductReviews.length;
export const mockAverageRating = Number((
  mockProductReviews.reduce((sum, rev) => sum + rev.rating, 0) / mockTotalReviews
).toFixed(1));
