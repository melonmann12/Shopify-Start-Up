'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { ShopifyImage } from '@/lib/shopify/types'

interface Props {
  images: ShopifyImage[]
  title: string
}

export default function ProductGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex]

  if (!images || images.length === 0) return null

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Image */}
      <div className="bg-surface-container-low rounded-xl overflow-hidden aspect-[4/5] relative">
        {active && (
          <Image
            src={active.url}
            alt={active.altText ?? title}
            fill
            priority
            className="w-full h-full object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        )}
      </div>

      {/* Thumbnail Strip */}
      <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
        {images.map((img, i) => (
          <button
            key={img.url}
            onClick={() => setActiveIndex(i)}
            className={`bg-surface-container-low rounded-xl overflow-hidden aspect-square hover:opacity-80 transition-opacity relative ${
              i === activeIndex ? 'border-2 border-outline-variant/20' : ''
            }`}
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
