'use client'
// components/product/ProductClient.tsx
// Owns shared variant state and renders the full two-column PDP layout.
import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/currency'
import VariantSelector from './VariantSelector'
import { viewContent } from '@/lib/analytics/metaPixel'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'

const UI_TEXT = {
  description: "Description",
}

interface Props {
  product: ShopifyProduct
  locale: string
}

export default function ProductClient({ product, locale }: Props) {

  // ── Variant State ────────────────────────────────────────────────────────────
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () =>
      product.options.reduce(
        (acc, option) => ({ ...acc, [option.name]: option.values[0] }),
        {} as Record<string, string>
      )
  )

  const selectedVariant = useMemo<ShopifyProductVariant | undefined>(
    () =>
      product.variants.nodes.find((variant) =>
        variant.selectedOptions.every(
          (opt) => selectedOptions[opt.name] === opt.value
        )
      ),
    [selectedOptions, product.variants.nodes]
  )

  const trackedProductRef = useRef<string | null>(null)

  useEffect(() => {
    if (trackedProductRef.current === product.handle) return
    trackedProductRef.current = product.handle

    if (process.env.NODE_ENV === 'development') {
      console.log('[Meta Pixel] ProductClient mounted. Firing ViewContent once for:', product.handle)
    }

    const variantId = selectedVariant?.id || product.variants.nodes[0]?.id
    if (variantId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Meta Pixel] ProductClient firing ViewContent for:', {
          handle: product.handle,
          title: product.title,
          variantId,
          price: product.priceRange.minVariantPrice.amount,
          fbqExists: typeof window !== 'undefined' && !!window.fbq
        })
      }
      viewContent(
        variantId,
        product.title,
        Number(product.priceRange.minVariantPrice.amount)
      )
    }
  }, [product.handle, product.title, product.priceRange.minVariantPrice.amount, product.variants.nodes])

  // ── Gallery State ─────────────────────────────────────────────────────────────
  const [displayIndex, setDisplayIndex] = useState(0)
  const allImages = product.images.nodes
  const lastVariantImageUrl = useRef<string | undefined>(undefined)

  useEffect(() => {
    const variantImageUrl = selectedVariant?.image?.url
    if (variantImageUrl && variantImageUrl !== lastVariantImageUrl.current) {
      lastVariantImageUrl.current = variantImageUrl
      const idx = allImages.findIndex((img) => img.url === variantImageUrl)
      if (idx >= 0) {
        setDisplayIndex(idx)
      }
    }
  }, [selectedVariant, allImages])

  const mobileCarouselRef = useRef<HTMLDivElement>(null)

  function scrollToImage(index: number) {
    setDisplayIndex(index)
    if (mobileCarouselRef.current) {
      const container = mobileCarouselRef.current
      const width = container.clientWidth
      container.scrollTo({
        left: width * index,
        behavior: 'smooth',
      })
    }
  }

  function handleMobileScroll(e: React.UIEvent<HTMLDivElement>) {
    const container = e.currentTarget
    const scrollLeft = container.scrollLeft
    const width = container.clientWidth
    const index = Math.round(scrollLeft / width)
    if (index !== displayIndex && index >= 0 && index < allImages.length) {
      setDisplayIndex(index)
    }
  }

  // ── Accordion State ───────────────────────────────────────────────────────────
  const [activeAccordion, setActiveAccordion] = useState<Record<string, boolean>>({
    included: false,
    sizing: false,
    application: false,
  })

  function toggleAccordion(key: string) {
    setActiveAccordion((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function selectOption(name: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }))
  }

  const displayBadgeText = product.title.split(' ')[0]
  const basePrice = product.priceRange.minVariantPrice

  return (
    <div className="w-full flex flex-col gap-16 md:gap-24">
      {/* ── Main PDP Split View ──────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-[8.333vw] w-full">
        
        {/* ── LEFT: Image Gallery ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col gap-3">
          {/* Mobile Swipe Slider */}
          <div className="md:hidden relative w-full aspect-square bg-surface-container-lowest border border-on-background overflow-hidden group">
            <div
              ref={mobileCarouselRef}
              onScroll={handleMobileScroll}
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-none"
            >
              {allImages.map((img, i) => (
                <div key={img.url + '-mob'} className="w-full h-full shrink-0 snap-center relative aspect-square">
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.title}
                    fill
                    priority={true}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) calc(100vw - 3rem), 55vw"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const prevIdx = displayIndex === 0 ? allImages.length - 1 : displayIndex - 1
                    scrollToImage(prevIdx)
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-outline/10 flex items-center justify-center text-on-background hover:bg-white active:scale-95 transition-all focus:outline-none z-20"
                  aria-label="Previous image"
                >
                  <span className="material-symbols-outlined text-base select-none">chevron_left</span>
                </button>
                <button
                  onClick={() => {
                    const nextIdx = displayIndex === allImages.length - 1 ? 0 : displayIndex + 1
                    scrollToImage(nextIdx)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-outline/10 flex items-center justify-center text-on-background hover:bg-white active:scale-95 transition-all focus:outline-none z-20"
                  aria-label="Next image"
                >
                  <span className="material-symbols-outlined text-base select-none">chevron_right</span>
                </button>
              </>
            )}
          </div>

          {/* Desktop Main Image */}
          <div className="hidden md:block bg-surface-container-lowest border border-on-background overflow-hidden aspect-square relative group">
            {allImages.map((img, i) => (
              <div
                key={img.url + '-desk'}
                className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${ i === displayIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none' }`}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? product.title}
                  fill
                  priority={true}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            ))}

            {/* Desktop Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const prevIdx = displayIndex === 0 ? allImages.length - 1 : displayIndex - 1
                    scrollToImage(prevIdx)
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/70 backdrop-blur-sm border border-outline/10 flex items-center justify-center text-on-background hover:bg-white hover:border-outline-variant/30 active:scale-95 transition-all focus:outline-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Previous image"
                >
                  <span className="material-symbols-outlined text-base select-none">chevron_left</span>
                </button>
                <button
                  onClick={() => {
                    const nextIdx = displayIndex === allImages.length - 1 ? 0 : displayIndex + 1
                    scrollToImage(nextIdx)
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/70 backdrop-blur-sm border border-outline/10 flex items-center justify-center text-on-background hover:bg-white hover:border-outline-variant/30 active:scale-95 transition-all focus:outline-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Next image"
                >
                  <span className="material-symbols-outlined text-base select-none">chevron_right</span>
                </button>
              </>
            )}
          </div>

          {/* Desktop Thumbnail Strip */}
          <div className="hidden md:grid grid-cols-4 md:grid-cols-5 gap-2.5">
            {allImages.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setDisplayIndex(i)}
                className={`bg-surface-container-lowest border border-on-background overflow-hidden aspect-square hover:opacity-80 transition-all relative ${ i === displayIndex ? 'ring-1 ring-on-background' : '' }`}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? product.title}
                  fill
                  className="w-full h-full object-cover"
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Product Info + Variant Selector ──────────────────────────── */}
        <div className="w-full lg:w-[45%] flex flex-col pt-0">
          {/* Static product details */}
          <div className="mb-5">
            <p className="text-on-surface-variant mb-2 text-label">
              {'nailestial'}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-on-background tracking-normal mb-2 leading-tight">
              {product.title}
            </h1>
            <p className="text-2xl sm:text-3xl font-serif text-on-background">
              {formatPrice(basePrice.amount, basePrice.currencyCode, locale)}
            </p>
          </div>


          {/* Controlled variant selector (shares state with gallery above) */}
          <VariantSelector
            product={product}
            locale={locale}
            selectedOptions={selectedOptions}
            selectedVariant={selectedVariant}
            onSelectOption={selectOption}
          />

          {/* 2. Collapsible Product Info Accordion */}
          <div className="border-t border-outline/10 mt-6 space-y-0">
            {/* Tab: What's Included */}
            <div className="border-b border-outline/10">
              <button
                onClick={() => toggleAccordion('included')}
                className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="text-on-surface font-sans font-normal text-sm uppercase tracking-[0.05em]">
                  What&apos;s Included
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 group-hover:text-on-background transition-transform duration-300">
                  {activeAccordion.included ? 'remove' : 'add'}
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${ activeAccordion.included ? 'max-h-[200px] pb-4' : 'max-h-0' }`}
              >
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed font-light">
                  Every <span className="font-semibold text-on-background">Nailestial</span> set comes with a complete prep kit: 1x Nail Glue, 1x Adhesive Tabs, 1x Mini File, 1x Cuticle Stick, and 1x Alcohol Prep Pad.
                </p>
              </div>
            </div>

            {/* Tab: Sizing Guide */}
            <div className="border-b border-outline/10">
              <button
                onClick={() => toggleAccordion('sizing')}
                className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="text-on-surface font-sans font-normal text-sm uppercase tracking-[0.05em]">
                  Sizing Guide
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 group-hover:text-on-background transition-transform duration-300">
                  {activeAccordion.sizing ? 'remove' : 'add'}
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${ activeAccordion.sizing ? 'max-h-[200px] pb-4' : 'max-h-0' }`}
              >
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed font-light">
                  Measure the widest part of your nail bed in millimeters or select from XS, S, M, L standard sizes. Refer to our Size Chart for seamless fitting.
                </p>
              </div>
            </div>

            {/* Tab: Application & Removal */}
            <div className="border-b border-outline/10">
              <button
                onClick={() => toggleAccordion('application')}
                className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="text-on-surface font-sans font-normal text-sm uppercase tracking-[0.05em]">
                  Application & Removal
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 group-hover:text-on-background transition-transform duration-300">
                  {activeAccordion.application ? 'remove' : 'add'}
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${ activeAccordion.application ? 'max-h-[300px] pb-4' : 'max-h-0' }`}
              >
                <div className="font-sans text-sm text-on-surface-variant leading-relaxed font-light space-y-3">
                  <div>
                    <strong className="block text-on-background mb-0.5 font-sans font-normal text-[13px] uppercase tracking-[0.05em]">
                      Application:
                    </strong>
                    Prep your natural nails, apply the adhesive tabs or glue, align the press-on at a 45° angle, and press down firmly for 15 seconds.
                  </div>
                  <div>
                    <strong className="block text-on-background mb-0.5 font-sans font-normal text-[13px] uppercase tracking-[0.05em]">
                      Removal:
                    </strong>
                    Soak your hands in warm water mixed with soap and oil for 10-15 minutes, then gently lift the edges with the cuticle stick.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Panel */}
          {/* Description intentionally hidden for now to increase conversion focus
          <div className="border-t border-outline/10 pt-8 mt-8">
            <h3 className="text-on-surface-variant mb-6 text-label">
              {UI_TEXT.description}
            </h3>
            <div
              className="text-on-surface-variant leading-relaxed font-sans text-sm font-light [&_p]:mb-4 [&_ul]:mt-6 [&_ul]:space-y-3 [&_ul]:text-sm [&_li]:flex [&_li]:items-center [&_li]:gap-3 [&_li]:before:content-[''] [&_li]:before:w-1 [&_li]:before:h-1 [&_li]:before:bg-outline [&_li]:before:shrink-0"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
          */}
        </div>

      </div>

      {/* Comparison section (Craftsmanship Breakdown) intentionally removed from render to focus on conversion */}
    </div>
  )
}
