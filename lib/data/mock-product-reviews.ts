import type { ProductReview } from '@/lib/judgeme/adapter'

export const mockProductReviews: ProductReview[] = [
  {
    id: 'mock-1',
    reviewerName: 'Sarah M.',
    rating: 5,
    title: 'Obsessed with these!',
    body: 'First time trying press-ons and I am never going back to the salon. The quality is amazing, they look exactly like acrylics but without the damage. I got so many compliments!',
    selectedShape: 'Almond',
    selectedSize: 'Medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    verified: false,
    source: 'sample'
  },
  {
    id: 'mock-2',
    reviewerName: 'Jessica T.',
    rating: 5,
    title: 'Perfect fit and super durable',
    body: 'I was worried about the sizing but the guide was super helpful. These have lasted me 2 weeks already and still look brand new. The glue is really strong.',
    selectedShape: 'Coffin',
    selectedSize: 'Small',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    verified: false,
    source: 'sample'
  },
  {
    id: 'mock-3',
    reviewerName: 'Emily R.',
    rating: 5,
    title: 'Beautiful design',
    body: 'The artwork on these is incredible. I love that I can have intricate designs without sitting in a chair for hours. Super easy to apply!',
    selectedShape: 'Square',
    selectedSize: 'Large',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    verified: false,
    source: 'sample'
  },
  {
    id: 'mock-4',
    reviewerName: 'Amanda L.',
    rating: 5,
    title: 'Best press-ons ever',
    body: 'I have tried every brand out there and Nailestial is by far the best. The nails feel thick and sturdy, not flimsy at all. They look incredibly natural.',
    selectedShape: 'Almond',
    selectedSize: 'Medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    verified: false,
    source: 'sample'
  }
]

export const mockTotalReviews = mockProductReviews.length
export const mockAverageRating = Number((mockProductReviews.reduce((sum, rev) => sum + rev.rating, 0) / mockTotalReviews).toFixed(1))
