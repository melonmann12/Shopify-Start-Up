'use client'
// components/product/ProductClient.tsx
// Owns shared variant state and renders the full two-column PDP layout.
import { useState, useMemo } from 'react'
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
  const [manualIndex, setManualIndex] = useState(0)
  const allImages = product.images.nodes

  // Auto-jump to variant image when selection changes
  const variantImageUrl = selectedVariant?.image?.url
  const variantImageIndex = variantImageUrl
    ? allImages.findIndex((img) => img.url === variantImageUrl)
    : -1
  const displayIndex = variantImageIndex >= 0 ? variantImageIndex : manualIndex

  function selectOption(name: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }))
  }

  const displayBadgeText = product.title.split(' ')[0]
  const basePrice = product.priceRange.minVariantPrice

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-[8.333vw] w-full">
      {/* ── LEFT: Image Gallery ─────────────────────────────────────────────── */}
      <div className="w-full lg:w-[55%] flex flex-col gap-4">
        {/* Mobile Swipe Slider */}
        <div className="md:hidden relative w-full aspect-[4/5] bg-surface-container-lowest border border-outline/30 overflow-hidden">
          <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-none">
            {allImages.map((img, i) => (
              <div key={img.url + '-mob'} className="w-full h-full shrink-0 snap-center relative aspect-[4/5]">
                <Image
                  src={img.url}
                  alt={img.altText ?? product.title}
                  fill
                  priority={i === 0}
                  className="w-full h-full object-cover saturate-50 contrast-[1.1]"
                  sizes="(max-width: 768px) calc(100vw - 3rem), 55vw"
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-6 right-6 bg-surface-container-lowest/90 px-4 py-1.5 border border-outline/30 md:backdrop-blur-sm">
            <span className="font-serif text-lg text-on-background">{displayBadgeText}</span>
          </div>
        </div>

        {/* Desktop Main Image */}
        <div className="hidden md:block bg-surface-container-lowest border border-outline/30 overflow-hidden aspect-[4/5] relative">
          {allImages[displayIndex] && (
            <Image
              src={allImages[displayIndex].url}
              alt={allImages[displayIndex].altText ?? product.title}
              fill
              priority
              className="w-full h-full object-cover saturate-50 contrast-[1.1]"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          )}
          <div className="absolute bottom-8 right-8 bg-surface-container-lowest/90 px-6 py-2 shadow-sm border border-outline/30 md:backdrop-blur-sm">
            <span className="font-serif text-2xl text-on-background">{displayBadgeText}</span>
          </div>
        </div>

        {/* Desktop Thumbnail Strip */}
        <div className="hidden md:grid grid-cols-4 md:grid-cols-5 gap-4">
          {allImages.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setManualIndex(i)}
              className={`bg-surface-container-lowest border overflow-hidden aspect-square hover:opacity-80 transition-all relative ${
                i === displayIndex ? 'border-on-background border-2' : 'border-outline/30'
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? product.title}
                fill
                className="w-full h-full object-cover saturate-50 contrast-[1.1]"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Product Info + Variant Selector ──────────────────────────── */}
      <div className="w-full lg:w-[45%] flex flex-col pt-0 lg:pt-8">
        {/* Static product details */}
        <div className="mb-8 md:mb-12">
          <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em] mb-4">
            {product.vendor || 'tiaranails'}
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

        {/* Description Panel */}
        <div className="border-t border-outline/20 pt-8 mt-8">
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
  )
}

