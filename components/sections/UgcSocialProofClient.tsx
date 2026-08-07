'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import type { UgcItem } from '@/lib/data/ugc'

interface Props {
  locale: string
  items: UgcItem[]
}

export default function UgcSocialProofClient({ locale, items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Drag prevention state
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(Math.ceil(scrollLeft) > 2)
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 2)
    }
  }

  useEffect(() => {
    handleScroll()
    window.addEventListener('resize', handleScroll)
    return () => window.removeEventListener('resize', handleScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth, scrollWidth, scrollLeft } = scrollRef.current
      
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -clientWidth, behavior: 'smooth' })
      } else {
        const maxScrollLeft = scrollWidth - clientWidth
        const targetScroll = scrollLeft + clientWidth
        const finalScroll = targetScroll > maxScrollLeft ? maxScrollLeft : targetScroll
        scrollRef.current.scrollTo({ left: finalScroll, behavior: 'smooth' })
      }
    }
  }

  // Handle drag prevention so users dragging the carousel don't accidentally click links
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = false
    startX.current = e.clientX
    startY.current = e.clientY
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    // If we've moved more than a few pixels, consider it a drag
    if (Math.abs(e.clientX - startX.current) > 10 || Math.abs(e.clientY - startY.current) > 10) {
      isDragging.current = true
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.preventDefault()
    }
  }

  const href = `/${locale}/search?sort=best-selling`

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 my-10 md:my-16 lg:my-20 relative z-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Left Column: Text & CTA */}
        <div className="w-full lg:w-[40%] lg:min-w-[420px] lg:max-w-[480px] flex flex-col items-start shrink-0">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-on-background tracking-normal mb-3 uppercase">
            SEE NAILestial IN REAL LIFE
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg mb-6">
            See how our press-on nails look beyond the studio.
          </p>
          <Link
            href={href}
            className="text-xs text-on-surface hover:text-on-surface-variant flex items-center gap-2 pb-0.5 border-b border-primary group text-label shrink-0"
          >
            SHOP BEST SELLERS <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
          </Link>
          
          {/* Controls (Desktop Only) */}
          <div className="hidden lg:flex gap-4 mt-8">
            <button 
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous image"
              className={`w-10 h-10 rounded-full border border-on-background flex items-center justify-center transition-all ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-on-background hover:text-background cursor-pointer'}`}
            >
              <span className="material-symbols-outlined text-sm" data-icon="arrow_back">arrow_back</span>
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next image"
              className={`w-10 h-10 rounded-full border border-on-background flex items-center justify-center transition-all ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-on-background hover:text-background cursor-pointer'}`}
            >
              <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right Column: Carousel */}
        <div className="w-full lg:flex-1 relative -mx-6 md:-mx-12 lg:mx-0 px-6 md:px-12 lg:px-0">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {items.map((item) => {
              const hasProduct = !!item.product
              
              const innerContent = (
                <div 
                  className="w-full h-full relative"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.altText || (hasProduct ? `Customer photo showing ${item.product!.title}` : "Customer wearing Nailestial press-on nails")}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  
                  {hasProduct && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end">
                      <span className="text-white text-xs opacity-90 mb-1">Wearing:</span>
                      <span className="text-white text-sm font-medium tracking-wide">{item.product!.title}</span>
                      <span className="text-white text-[10px] uppercase tracking-wider mt-2 opacity-80">Shop This Look →</span>
                    </div>
                  )}
                </div>
              )

              return (
                <div 
                  key={item.id} 
                  className={`snap-start flex-none w-[80vw] sm:w-[320px] lg:w-[260px] xl:w-[280px] relative rounded-2xl overflow-hidden bg-surface aspect-[3/4] group ${hasProduct ? 'cursor-pointer' : ''}`}
                >
                  {hasProduct ? (
                    <Link 
                      href={`/${locale}/products/${item.product!.handle}`}
                      onClick={handleClick}
                      className="block w-full h-full"
                      aria-label={`Shop ${item.product!.title} shown in this customer photo`}
                    >
                      {innerContent}
                    </Link>
                  ) : (
                    innerContent
                  )}
                </div>
              )
            })}
            {/* Spacer for the last item to ensure it's not flush with the container edge and fully scrollable */}
            <div className="shrink-0 w-6 md:w-12 lg:w-16 xl:w-20" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
