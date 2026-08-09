'use client'

import { useRef, useState, useEffect } from 'react'
import type { ProductReview } from '@/lib/judgeme/adapter'
import ReviewFormModal from './ReviewFormModal'

interface ProductReviewsProps {
  locale: string
  reviews: ProductReview[]
  averageRating: number
  totalReviews: number
  productId: string
  productTitle: string
}

export default function ProductReviews({ locale, reviews, averageRating, totalReviews, productId, productTitle }: ProductReviewsProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const hasRealReviews = reviews.length > 0

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

  // Handle Escape key for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxImage) setLightboxImage(null)
    }
    if (lightboxImage) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [lightboxImage])

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
    <section id="customer-reviews" className="w-full border-t border-outline-variant/30 pt-8 md:pt-12 scroll-mt-24 md:scroll-mt-32">
      {/* Review Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-on-background mb-4">
            {locale === 'vi' ? 'Đánh giá của khách hàng' : 'Customer Reviews'}
          </h2>
          
          {hasRealReviews && (
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5 text-on-background">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: `'FILL' ${i < Math.round(averageRating) ? 1 : 0}` }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="font-sans text-sm font-medium text-on-background">
                {averageRating}
              </span>
              <span className="font-sans text-sm text-on-surface-variant">
                ({totalReviews} {locale === 'vi' ? 'đánh giá' : totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
          
          <div className="mt-6 md:mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-black text-white text-xs md:text-sm uppercase tracking-wider hover:bg-black/85 transition-colors rounded-sm font-medium"
            >
              {locale === 'vi' ? 'VIẾT ĐÁNH GIÁ' : 'WRITE A REVIEW'}
            </button>
          </div>
        </div>

        {/* Desktop Carousel Controls */}
        {hasRealReviews && reviews.length > 1 && (
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
        )}
      </div>

      {/* Review Carousel or Empty State */}
      {!hasRealReviews ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-outline-variant/30 rounded-sm bg-surface-container-lowest text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/50 mb-4">rate_review</span>
          <p className="font-sans text-sm text-on-surface-variant mb-6">
            {locale === 'vi' ? 'Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn.' : 'No reviews yet. Be the first to share your experience.'}
          </p>
        </div>
      ) : (
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-6 -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review) => {
            const publishedPictures = review.hasPublishedPictures && review.pictures 
              ? review.pictures.filter(p => !p.hidden) 
              : [];

            return (
              <div 
                key={review.id}
                className="snap-start shrink-0 w-[85vw] sm:w-[450px] md:w-[560px] lg:w-[640px] flex flex-col p-5 md:p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  {renderStars(review.rating)}
                  <span className="text-xs text-on-surface-variant">
                    {new Date(review.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <h3 className="font-serif text-xl text-on-background mb-2">
                  {review.title}
                </h3>
                
                <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed mb-4">
                  {review.body}
                </p>

                {/* Render published review images if any exist */}
                {publishedPictures.length > 0 && (
                  <div className="flex gap-3 mb-4 overflow-x-auto pb-2 hide-scrollbar">
                    {publishedPictures.map((pic, idx) => {
                      // Fallback to whichever URL exists
                      const imgUrl = pic.urls?.compact || pic.urls?.small || pic.urls?.huge || pic.urls?.original;
                      const fullUrl = pic.urls?.original || pic.urls?.huge || imgUrl;
                      
                      if (!imgUrl) return null;

                      return (
                        <div 
                          key={idx} 
                          className="relative w-24 h-24 md:w-[120px] md:h-[120px] shrink-0 rounded-sm overflow-hidden border border-outline-variant/20 cursor-pointer group"
                          onClick={() => {
                            if (fullUrl) setLightboxImage(fullUrl);
                          }}
                          title="Click to view full image"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={imgUrl} 
                            alt={`Review image ${idx + 1}`} 
                            className="w-full h-full object-cover transition-opacity group-hover:opacity-80" 
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                            <span className="material-symbols-outlined text-white text-[24px]">zoom_in</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                
                <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-outline-variant/20">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans text-sm font-medium text-on-background">
                        {review.reviewerName}
                      </span>
                      {review.verified && (
                        <span className="material-symbols-outlined text-[15px] text-green-600" aria-label="Verified Buyer" title="Verified Buyer">
                          check_circle
                        </span>
                      )}
                    </div>
                    
                    {(review.selectedSize || review.selectedShape) && (
                      <span className="font-sans text-xs text-on-surface-variant">
                        {review.selectedShape}{review.selectedShape && review.selectedSize ? ' • ' : ''}{review.selectedSize}
                      </span>
                    )}
                  </div>
                  
                  {/* TODO: Implement Merchant Replies. 
                      Judge.me GET /reviews API does not currently expose public merchant replies.
                      When available, render them here in a distinct styled block. */}
                </div>
              </div>
            )
          })}
        </div>
      )}


      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <ReviewFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        productTitle={productTitle}
      />

      {/* Lightweight Image Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 z-10"
            onClick={() => setLightboxImage(null)}
            aria-label="Close image"
          >
            <span className="material-symbols-outlined text-[32px]">close</span>
          </button>
          
          <div className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={lightboxImage} 
              alt="Review full size" 
              className="max-w-full max-h-[90vh] object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()} // Prevent click-through closing when clicking the image itself
            />
          </div>
        </div>
      )}
    </section>
  )
}
