'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import type { ShopifyImage } from '@/lib/shopify/types'

interface Props {
  images: ShopifyImage[]
  title: string
}

export default function ProductGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  if (!images || images.length === 0) return null

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollLeft = container.scrollLeft
    const width = container.clientWidth
    if (width > 0) {
      const index = Math.round(scrollLeft / width)
      if (index >= 0 && index < images.length && index !== activeIndex) {
        setActiveIndex(index)
      }
    }
  }

  const scrollToImage = (index: number) => {
    setActiveIndex(index)
    if (carouselRef.current) {
      const width = carouselRef.current.clientWidth
      carouselRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth'
      })
    }
  }

  const displayBadgeText = title.split(' ')[0]

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Mobile Swipe Slider/Carousel */}
      <div className="md:hidden relative w-full aspect-square bg-surface-container-lowest border border-outline/30 overflow-hidden">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-none"
        >
          {images.map((img, i) => (
            <div key={img.url + '-mob'} className="w-full h-full shrink-0 snap-center relative aspect-square">
              <Image
                src={img.url}
                alt={img.altText ?? title}
                fill
                priority={i === 0}
                className="w-full h-full object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Minimalist Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToImage(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-[2px] transition-all duration-300 ${ i === activeIndex ? 'w-8 bg-on-background' : 'w-4 bg-on-background/20' }`}
            />
          ))}
        </div>

        {/* Small Brand Badge */}
        <div className="absolute bottom-6 right-6 bg-surface-container-lowest/90 px-4 py-1.5 border border-outline/30 md:backdrop-blur-sm">
          <span className="font-serif text-lg text-on-background">{displayBadgeText}</span>
        </div>
      </div>

      {/* Desktop Main Image */}
      <div className="hidden md:block bg-surface-container-lowest border border-outline/30 overflow-hidden aspect-square relative">
        {images[activeIndex] && (
          <Image
            src={images[activeIndex].url}
            alt={images[activeIndex].altText ?? title}
            fill
            priority
            className="w-full h-full object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        )}
        <div className="absolute bottom-8 right-8 bg-surface-container-lowest/90 px-6 py-2 shadow-sm border border-outline/30 md:backdrop-blur-sm">
          <span className="font-serif text-2xl text-on-background">{displayBadgeText}</span>
        </div>
      </div>

      {/* Desktop Thumbnail Strip */}
      <div className="hidden md:grid grid-cols-4 md:grid-cols-5 gap-4">
        {images.map((img, i) => (
          <button
            key={img.url}
            onClick={() => scrollToImage(i)}
            className={`bg-surface-container-lowest border overflow-hidden aspect-square hover:opacity-80 transition-all relative ${ i === activeIndex ? 'border-on-background border-2' : 'border-outline/30' }`}
          >
            <Image
              src={img.url}
              alt={img.altText ?? title}
              fill
              className="w-full h-full object-cover"
              sizes="120px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
