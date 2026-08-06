'use client'

import { useRef, useState, useEffect } from 'react'
import { mockProductReviews, mockTotalReviews, mockAverageRating } from '@/lib/data/mock-product-reviews'

interface ProductReviewsProps {
  locale: string
}

export default function ProductReviews({ locale }: ProductReviewsProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // We now import the aggregates directly to avoid duplication
  const totalReviews = mockTotalReviews
  const averageRating = mockAverageRating.toFixed(1)

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth)
    }
  }

  useEffect(() => {
    const el = carouselRef.current
    if (el) {
      checkScroll()
      el.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      return () => {
        el.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [])

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      // Scroll by approximately one card width
      const scrollAmount = direction === 'left' ? -320 : 320
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div 
        className="flex gap-0.5 text-on-background" 
        aria-label={`${rating} out of 5 stars`}
      >
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined text-[14px]"
            style={{ fontVariationSettings: `'FILL' ${i < rating ? 1 : 0}` }}
          >
            star
          </span>
        ))}
      </div>
    )
  }

  return (
    <section id="customer-reviews" className="w-full border-t border-outline-variant/30 pt-8 md:pt-12">
      {/* Review Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-on-background mb-4">
            {locale === 'vi' ? 'Đánh giá của khách hàng' : 'Customer Reviews'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5 text-on-background">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: `'FILL' 1` }}
                >
                  star
                </span>
              ))}
            </div>
            <span className="font-sans text-sm font-medium text-on-background">
              {averageRating}
            </span>
            <span className="font-sans text-sm text-on-surface-variant">
              ({totalReviews} {locale === 'vi' ? 'đánh giá' : 'reviews'})
            </span>
          </div>
        </div>

        {/* Desktop Carousel Controls */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scrollByAmount('left')}
            disabled={!canScrollLeft}
            aria-label="Previous reviews"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-background hover:bg-surface-variant/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button
            onClick={() => scrollByAmount('right')}
            disabled={!canScrollRight}
            aria-label="Next reviews"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-background hover:bg-surface-variant/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Review Carousel */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-6 -mx-6 px-6 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mockProductReviews.map((review) => (
          <div 
            key={review.id}
            className="snap-start shrink-0 w-[85vw] sm:w-[300px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col p-6 md:p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-sm"
          >
            <div className="flex justify-between items-start mb-4">
              {renderStars(review.rating)}
              <span className="text-xs text-on-surface-variant">
                {new Date(review.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <h3 className="font-serif text-lg text-on-background mb-2">
              {review.title}
            </h3>
            
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6 flex-grow">
              {review.body}
            </p>
            
            <div className="flex flex-col gap-1 mt-auto pt-6 border-t border-outline-variant/20">
              <span className="font-sans text-sm font-medium text-on-background">
                {review.reviewerName}
              </span>
              {(review.selectedSize || review.selectedShape) && (
                <span className="font-sans text-xs text-on-surface-variant">
                  {review.selectedShape}{review.selectedShape && review.selectedSize ? ' • ' : ''}{review.selectedSize}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
