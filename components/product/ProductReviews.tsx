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
  const [activeReview, setActiveReview] = useState<ProductReview | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

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

  // Handle Escape key for Lightbox/Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeReview) {
        setActiveReview(null)
      }
    }
    if (activeReview) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [activeReview])

  const openReviewModal = (review: ProductReview, imageIndex = 0) => {
    setActiveReview(review)
    setActiveImageIndex(imageIndex)
  }

  const closeReviewModal = () => {
    setActiveReview(null)
    setActiveImageIndex(0)
  }

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
    <section id="customer-reviews" className="w-full border-t border-black/10 pt-8 md:pt-12 scroll-mt-24 md:scroll-mt-32">
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
                className="snap-start shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] lg:w-[360px] flex flex-col p-5 md:p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-sm"
              >
                {/* Header: Stars, Name, Date */}
                <div className="flex flex-col gap-2 mb-4">
                  {renderStars(review.rating)}
                  <div className="flex justify-between items-start w-full gap-2">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="font-sans text-sm font-medium text-on-background truncate">
                        {review.reviewerName}
                      </span>
                      {review.verified && (
                        <span className="material-symbols-outlined text-[15px] text-green-600 shrink-0" aria-label="Verified Buyer" title="Verified Buyer">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-on-surface-variant shrink-0 mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-serif text-lg md:text-xl text-on-background mb-2">
                  {review.title}
                </h3>
                
                <div className="mb-4">
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed line-clamp-4">
                    {review.body}
                  </p>
                  
                  {/* More button */}
                  {(review.body.length > 150 || publishedPictures.length > 0) && (
                    <button 
                      onClick={() => openReviewModal(review)}
                      className="text-xs font-medium underline mt-2 text-on-background hover:text-on-surface-variant transition-colors"
                    >
                      {locale === 'vi' ? 'Xem thêm' : 'More'}
                    </button>
                  )}
                </div>

                {/* Render published review images if any exist */}
                {publishedPictures.length > 0 && (
                  <div className="flex gap-2 mt-auto overflow-x-auto hide-scrollbar pt-2">
                    {publishedPictures.map((pic, idx) => {
                      const imgUrl = pic.urls?.compact || pic.urls?.small || pic.urls?.huge || pic.urls?.original;
                      if (!imgUrl) return null;

                      return (
                        <div 
                          key={idx} 
                          className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-sm overflow-hidden border border-outline-variant/20 cursor-pointer group"
                          onClick={() => openReviewModal(review, idx)}
                          title="View review"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={imgUrl} 
                            alt={`Review image ${idx + 1}`} 
                            className="w-full h-full object-cover transition-opacity group-hover:opacity-80" 
                            loading="lazy"
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
                
                {(review.selectedSize || review.selectedShape) && (
                  <div className="mt-auto pt-4 border-t border-black/10">
                    <span className="font-sans text-xs text-on-surface-variant block">
                      {review.selectedShape}{review.selectedShape && review.selectedSize ? ' • ' : ''}{review.selectedSize}
                    </span>
                  </div>
                )}
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

      {/* Review Detail Modal */}
      {activeReview && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 md:p-8"
          onClick={closeReviewModal}
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Container */}
          <div 
            className={`relative flex flex-col md:flex-row bg-surface-container-lowest rounded-sm w-full max-h-[90vh] overflow-y-auto ${activeReview.hasPublishedPictures && activeReview.pictures && activeReview.pictures.filter(p => !p.hidden).length > 0 ? 'max-w-5xl' : 'max-w-2xl'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-on-background hover:text-on-surface-variant transition-colors p-2 z-10 bg-surface-container-lowest/80 rounded-full"
              onClick={closeReviewModal}
              aria-label="Close review modal"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            
            {/* Modal Content Logic */}
            {(() => {
              const reviewPics = activeReview.pictures ? activeReview.pictures.filter(p => !p.hidden) : [];
              const hasMedia = reviewPics.length > 0;
              
              const currentPicUrl = hasMedia ? (reviewPics[activeImageIndex].urls?.original || reviewPics[activeImageIndex].urls?.huge || reviewPics[activeImageIndex].urls?.small) : null;

              return (
                <>
                  {/* Left Column: Media (Only if hasMedia) */}
                  {hasMedia && (
                    <div className="w-full md:w-1/2 bg-surface-variant/20 flex flex-col">
                      <div className="relative flex-grow flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                        {currentPicUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={currentPicUrl} alt="Review media" className="w-full h-full object-contain max-h-[50vh] md:max-h-[70vh]" />
                        )}
                        
                        {/* Navigation Arrows */}
                        {reviewPics.length > 1 && (
                          <>
                            <button
                              className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black shadow-sm transition-colors"
                              onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : reviewPics.length - 1)); }}
                              aria-label="Previous image"
                            >
                              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            <button
                              className="absolute right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black shadow-sm transition-colors"
                              onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev < reviewPics.length - 1 ? prev + 1 : 0)); }}
                              aria-label="Next image"
                            >
                              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Thumbnails row */}
                      {reviewPics.length > 1 && (
                        <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar bg-surface-container-lowest">
                          {reviewPics.map((pic, idx) => {
                            const thumbUrl = pic.urls?.compact || pic.urls?.small;
                            if (!thumbUrl) return null;
                            return (
                              <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                                className={`w-16 h-16 shrink-0 rounded-sm overflow-hidden border ${idx === activeImageIndex ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/30 opacity-60 hover:opacity-100'} transition-all`}
                                aria-label={`View image ${idx + 1}`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Right Column / Centered Modal: Review Details */}
                  <div className={`w-full p-6 md:p-10 flex flex-col ${hasMedia ? 'md:w-1/2' : ''}`}>
                    <div className="mb-4">
                      {renderStars(activeReview.rating)}
                    </div>
                    
                    <div className="flex flex-col gap-1 mb-6 border-b border-black/10 pb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans text-base font-medium text-on-background">
                          {activeReview.reviewerName}
                        </span>
                        {activeReview.verified && (
                          <span className="material-symbols-outlined text-[16px] text-green-600" aria-label="Verified Buyer" title="Verified Buyer">
                            check_circle
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-on-surface-variant">
                        {new Date(activeReview.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {(activeReview.selectedSize || activeReview.selectedShape) && (
                        <span className="font-sans text-sm text-on-surface-variant mt-1">
                          {activeReview.selectedShape}{activeReview.selectedShape && activeReview.selectedSize ? ' • ' : ''}{activeReview.selectedSize}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-serif text-2xl text-on-background mb-4">
                      {activeReview.title}
                    </h3>
                    
                    <div className="prose prose-sm md:prose-base prose-neutral max-w-none text-on-surface-variant overflow-y-auto pr-2">
                      <p className="whitespace-pre-wrap">{activeReview.body}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  )
}
