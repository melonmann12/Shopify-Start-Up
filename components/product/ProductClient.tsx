'use client'
// components/product/ProductClient.tsx
// Owns shared variant state and renders the full two-column PDP layout.
import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/currency'
import VariantSelector from './VariantSelector'
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
        <div className="w-full lg:w-[55%] flex flex-col gap-4">
          {/* Mobile Swipe Slider */}
          <div className="md:hidden relative w-full aspect-square bg-surface-container-lowest border border-outline/30 overflow-hidden group">
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
          <div className="hidden md:block bg-surface-container-lowest border border-outline/30 overflow-hidden aspect-square relative group">
            {allImages.map((img, i) => (
              <div
                key={img.url + '-desk'}
                className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                  i === displayIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
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
          <div className="hidden md:grid grid-cols-4 md:grid-cols-5 gap-4">
            {allImages.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setDisplayIndex(i)}
                className={`bg-surface-container-lowest border overflow-hidden aspect-square hover:opacity-80 transition-all relative ${
                  i === displayIndex ? 'border-on-background border-2' : 'border-outline/30'
                }`}
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
        <div className="w-full lg:w-[45%] flex flex-col pt-0 lg:pt-8">
          {/* Static product details */}
          <div className="mb-8">
            <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em] mb-4">
              {'nailestial'}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-on-background tracking-normal mb-6 leading-tight">
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
          <div className="border-t border-outline/10 mt-8 space-y-0">
            {/* Tab: What's Included */}
            <div className="border-b border-outline/10">
              <button
                onClick={() => toggleAccordion('included')}
                className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface">
                  What's Included
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 group-hover:text-on-background transition-transform duration-300">
                  {activeAccordion.included ? 'remove' : 'add'}
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeAccordion.included ? 'max-h-[200px] pb-4' : 'max-h-0'
                }`}
              >
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed font-light">
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
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface">
                  Sizing Guide
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 group-hover:text-on-background transition-transform duration-300">
                  {activeAccordion.sizing ? 'remove' : 'add'}
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeAccordion.sizing ? 'max-h-[200px] pb-4' : 'max-h-0'
                }`}
              >
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed font-light">
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
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface">
                  Application & Removal
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 group-hover:text-on-background transition-transform duration-300">
                  {activeAccordion.application ? 'remove' : 'add'}
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeAccordion.application ? 'max-h-[300px] pb-4' : 'max-h-0'
                }`}
              >
                <div className="font-sans text-xs text-on-surface-variant leading-relaxed font-light space-y-3">
                  <div>
                    <strong className="font-mono text-[9px] uppercase tracking-wider block text-on-background mb-0.5">
                      Application:
                    </strong>
                    Prep your natural nails, apply the adhesive tabs or glue, align the press-on at a 45° angle, and press down firmly for 15 seconds.
                  </div>
                  <div>
                    <strong className="font-mono text-[9px] uppercase tracking-wider block text-on-background mb-0.5">
                      Removal:
                    </strong>
                    Soak your hands in warm water mixed with soap and oil for 10-15 minutes, then gently lift the edges with the cuticle stick.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Panel */}
          <div className="border-t border-outline/10 pt-8 mt-8">
            <h3 className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em] mb-6">
              {UI_TEXT.description}
            </h3>
            <div
              className="text-on-surface-variant leading-relaxed font-sans text-sm font-light [&_p]:mb-4 [&_ul]:mt-6 [&_ul]:space-y-3 [&_ul]:text-sm [&_li]:flex [&_li]:items-center [&_li]:gap-3 [&_li]:before:content-[''] [&_li]:before:w-1 [&_li]:before:h-1 [&_li]:before:bg-outline [&_li]:before:shrink-0"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>

      </div>

      {/* ── 3. High-End vs. Competitor Comparison Table (Full Width Block) ─────── */}
      <div className="border-t border-outline/10 pt-16 md:pt-24 mt-8 w-full">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-on-surface-variant mb-3 block">
            Craftsmanship Breakdown
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-on-background tracking-normal">
            Why Choose Nailestial
          </h2>
        </div>

        {/* Desktop Layout: HTML Table / CSS Grid */}
        <div className="hidden md:grid grid-cols-4 gap-0 border border-outline/10 bg-[#000000]/5">
          {/* Header row */}
          <div className="py-6 px-6 font-mono text-[9px] uppercase tracking-wider text-on-surface-variant flex items-center border-b border-outline/10">
            Feature Comparison
          </div>
          <div className="py-6 px-6 text-center font-mono text-xs font-bold bg-black/5 border-l border-b border-outline/10 flex flex-col justify-center items-center">
            <span className="text-on-background">Nailestial</span>
            <span className="text-[9px] text-on-surface-variant/80 font-normal mt-1 lowercase">(3d press-ons)</span>
          </div>
          <div className="py-6 px-6 text-center font-mono text-xs border-l border-b border-outline/10 flex flex-col justify-center items-center opacity-70">
            <span>Mass-Produced Nails</span>
          </div>
          <div className="py-6 px-6 text-center font-mono text-xs border-l border-b border-outline/10 flex flex-col justify-center items-center opacity-70">
            <span>Traditional Salon Gel</span>
          </div>

          {/* Row 1: Material */}
          <div className="py-6 px-6 font-mono text-xs text-on-surface border-b border-outline/10 flex items-center">
            Material
          </div>
          <div className="py-6 px-6 text-center border-l border-b border-outline/10 bg-black/5 flex items-center justify-center gap-2">
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-on-surface/5 text-on-surface select-none">
              <span className="material-symbols-outlined text-[12px] font-bold">check</span>
            </div>
            <span className="font-mono text-xs text-on-background font-semibold">Handmade Salon Gel</span>
          </div>
          <div className="py-6 px-6 text-center border-l border-b border-outline/10 flex items-center justify-center gap-2 opacity-80">
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none">
              <span className="material-symbols-outlined text-[12px] font-bold">close</span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">Thin Plastic</span>
          </div>
          <div className="py-6 px-6 text-center border-l border-b border-outline/10 flex items-center justify-center gap-2 opacity-80">
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-on-surface/5 text-on-surface select-none">
              <span className="material-symbols-outlined text-[12px] font-bold">check</span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">Acrylic</span>
          </div>

          {/* Row 2: Reusability */}
          <div className="py-6 px-6 font-mono text-xs text-on-surface border-b border-outline/10 flex items-center">
            Reusability
          </div>
          <div className="py-6 px-6 text-center border-l border-b border-outline/10 bg-black/5 flex items-center justify-center gap-2">
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-on-surface/5 text-on-surface select-none">
              <span className="material-symbols-outlined text-[12px] font-bold">check</span>
            </div>
            <span className="font-mono text-xs text-on-background font-semibold">Reusable for life</span>
          </div>
          <div className="py-6 px-6 text-center border-l border-b border-outline/10 flex items-center justify-center gap-2 opacity-80">
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none">
              <span className="material-symbols-outlined text-[12px] font-bold">close</span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">Single-use</span>
          </div>
          <div className="py-6 px-6 text-center border-l border-b border-outline/10 flex items-center justify-center gap-2 opacity-80">
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none">
              <span className="material-symbols-outlined text-[12px] font-bold">close</span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">Non-reusable</span>
          </div>

          {/* Row 3: Application Time */}
          <div className="py-6 px-6 font-mono text-xs text-on-surface flex items-center">
            Application Time
          </div>
          <div className="py-6 px-6 text-center border-l border-outline/10 bg-black/5 flex items-center justify-center gap-2">
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-on-surface/5 text-on-surface select-none">
              <span className="material-symbols-outlined text-[12px] font-bold">check</span>
            </div>
            <span className="font-mono text-xs text-on-background font-semibold">&lt;15 mins</span>
          </div>
          <div className="py-6 px-6 text-center border-l border-outline/10 flex items-center justify-center gap-2 opacity-80">
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none">
              <span className="material-symbols-outlined text-[12px] font-bold">close</span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">Cheap look</span>
          </div>
          <div className="py-6 px-6 text-center border-l border-outline/10 flex items-center justify-center gap-2 opacity-80">
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none">
              <span className="material-symbols-outlined text-[12px] font-bold">close</span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">2+ Hours intensive</span>
          </div>
        </div>

        {/* Mobile Layout: Stacked Cards (Clean blocks, no blur, high fps) */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {/* Nailestial card */}
          <div className="border border-primary bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline/10">
              <span className="font-mono text-sm font-bold text-on-background">Nailestial</span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">(3d press-ons)</span>
            </div>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2">
                <div className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-on-surface/5 text-on-surface select-none mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Material</span>
                  <span className="font-mono text-xs text-on-background font-semibold mt-0.5">Handmade Salon Gel</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-on-surface/5 text-on-surface select-none mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Reusability</span>
                  <span className="font-mono text-xs text-on-background font-semibold mt-0.5">Reusable for life</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-on-surface/5 text-on-surface select-none mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Application Time</span>
                  <span className="font-mono text-xs text-on-background font-semibold mt-0.5">&lt;15 mins</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Mass-Produced card */}
          <div className="border border-outline/10 bg-[#000000]/5 p-6 opacity-80">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline/10">
              <span className="font-mono text-sm text-on-surface-variant">Mass-Produced Nails</span>
            </div>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2">
                <div className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[10px] font-bold">close</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Material</span>
                  <span className="font-mono text-xs text-on-surface-variant mt-0.5">Thin Plastic</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[10px] font-bold">close</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Reusability</span>
                  <span className="font-mono text-xs text-on-surface-variant mt-0.5">Single-use</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[10px] font-bold">close</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Application Time</span>
                  <span className="font-mono text-xs text-on-surface-variant mt-0.5">Cheap look</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Salon card */}
          <div className="border border-outline/10 bg-[#000000]/5 p-6 opacity-80">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline/10">
              <span className="font-mono text-sm text-on-surface-variant">Traditional Salon Gel</span>
            </div>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2">
                <div className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-on-surface/5 text-on-surface select-none mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Material</span>
                  <span className="font-mono text-xs text-on-surface-variant mt-0.5">Acrylic</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[10px] font-bold">close</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Reusability</span>
                  <span className="font-mono text-xs text-on-surface-variant mt-0.5">Non-reusable</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[10px] font-bold">close</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Application Time</span>
                  <span className="font-mono text-xs text-on-surface-variant mt-0.5">2+ Hours intensive</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
