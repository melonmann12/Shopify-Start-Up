'use client'
// components/product/VariantSelector.tsx
import { useState, useEffect } from 'react'
import AddToCartButton from './AddToCartButton'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'

interface Props {
  product: ShopifyProduct
  locale: string
  // Controlled props from ProductClient (shared variant state)
  selectedOptions: Record<string, string>
  selectedVariant: ShopifyProductVariant | undefined
  onSelectOption: (name: string, value: string) => void
}

const CUSTOM_SIZE_VALUE = 'Custom'

const getColorHex = (colorName: string): string => {
  const name = colorName.toLowerCase()
  const map: Record<string, string> = {
    white: '#ffffff',
    black: '#1a1a1a',
    grey: '#8d99ae',
    gray: '#8d99ae',
    cream: '#fdfbf7',
    beige: '#f5f2eb',
    sage: '#b2c0b7',
    olive: '#6b705c',
    navy: '#1d2d44',
    sand: '#e3d5ca',
    brown: '#6c584c',
    charcoal: '#333333',
  }
  return map[name] ?? name
}

export default function VariantSelector({ product, locale, selectedOptions, selectedVariant, onSelectOption }: Props) {
  const [isShapeGuideOpen, setIsShapeGuideOpen] = useState(false)
  const [customSizeNote, setCustomSizeNote] = useState('')
  const [customSizeError, setCustomSizeError] = useState('')

  // Close drawer on Escape + lock body scroll while open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsShapeGuideOpen(false)
    }
    if (isShapeGuideOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isShapeGuideOpen])

  // Find the actual option name for "Size" from Shopify product data (handles any casing)
  const sizeOptionName = product.options.find(o => o.name.toLowerCase() === 'size')?.name
  const isCustomSize = sizeOptionName ? selectedOptions[sizeOptionName] === CUSTOM_SIZE_VALUE : false

  // Build attributes for the cart line item when custom size is selected
  const lineAttributes = isCustomSize && customSizeNote.trim()
    ? [{ key: 'Custom Size Note', value: customSizeNote.trim() }]
    : undefined

  // Validation callback — blocks add-to-cart if custom is selected but note is empty
  function validateCustomSize(): string | null {
    if (isCustomSize && !customSizeNote.trim()) {
      setCustomSizeError('Please enter your custom measurements before adding to bag.')
      return 'missing_custom_note'
    }
    setCustomSizeError('')
    return null
  }

  // Show the guide button once above all option selectors whenever the product
  // has a Size or Shape option. Products with only Shopify's default "Title"
  // option are excluded — those are placeholder/unvarianted products.
  const hasSizeOrShapeOptions = product.options.some((o) => {
    const n = o.name.toLowerCase()
    return n === 'size' || n === 'shape'
  })

  return (
    <div className="flex flex-col gap-10">
      {/* ── Size & Shape Guide trigger — rendered once above all option groups */}
      {hasSizeOrShapeOptions && (
        <div className="flex justify-end -mb-4">
          <button
            type="button"
            aria-label="Open size and shape guide"
            onClick={() => setIsShapeGuideOpen(true)}
            className="font-serif italic text-[13px] text-on-surface-variant hover:text-on-background underline decoration-outline-variant/30 hover:decoration-on-background underline-offset-4 transition-colors"
          >
            Size &amp; Shape Guide
          </button>
        </div>
      )}
      {product.options.map((option) => {
        const isSize = option.name.toLowerCase() === 'size'
        const isShape = option.name.toLowerCase() === 'shape'
        const isColor = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour'

        // For the size option, append "Custom" only if not already in the source data
        const values = isSize && !option.values.includes(CUSTOM_SIZE_VALUE)
          ? [...option.values, CUSTOM_SIZE_VALUE]
          : option.values

        return (
          <div key={option.id}>
            <div className="mb-4 flex items-start">
              <span className="text-on-surface-variant text-label">
                Select {option.name}
              </span>
            </div>

            <div className={isSize ? "grid grid-cols-4 sm:grid-cols-5 gap-3" : "grid grid-cols-2 sm:grid-cols-3 gap-2.5"}>
              {values.map((value, idx) => {
                const isSelected = selectedOptions[option.name] === value
                const isCustomOption = value === CUSTOM_SIZE_VALUE

                // Custom is always "available" — it's not a real variant
                const available = isCustomOption
                  ? true
                  : product.variants.nodes.some(
                    (v) =>
                      v.selectedOptions.some((o) => o.name === option.name && o.value === value) &&
                      v.availableForSale
                  )

                if (isColor) {
                  // Color Selector: Minimalist Rectangles
                  return (
                    <button
                      key={`${option.id}-${idx}-${value}`}
                      onClick={() => onSelectOption(option.name, value)}
                      disabled={!available}
                      title={value}
                      className={`w-12 h-8 transition-colors relative border duration-200 ${isSelected ? 'border-2 border-on-background' : 'border-outline/40 hover:border-on-background'} ${!available ? 'opacity-30 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: getColorHex(value) }}
                    >
                      <span className="sr-only">{value}</span>
                    </button>
                  )
                }

                // Text Swatch Buttons (Size grid or Shape grid)
                return (
                  <button
                    key={`${option.id}-${idx}-${value}`}
                    onClick={() => {
                      onSelectOption(option.name, value)
                      // Clear error when switching away from Custom, or when re-selecting Custom
                      if (!isCustomOption) {
                        setCustomSizeError('')
                      }
                    }}
                    disabled={!available}
                    className={`py-2.5 px-3 transition-colors border duration-200 text-[11px] leading-snug text-center
                      ${isSelected
                        ? 'border-2 border-on-background bg-surface-container-lowest text-on-background font-bold'
                        : available
                          ? 'border border-outline/40 bg-transparent text-on-surface-variant hover:border-on-background hover:text-on-background'
                          : 'border border-outline/20 bg-transparent text-on-surface-variant/40 cursor-not-allowed'
                      } ${isSize ? 'text-label' : 'uppercase tracking-[0.04em]'}`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>

            {/* Custom Size Note Input — revealed smoothly when "Custom" is selected */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${isSize ? isCustomSize ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0 pointer-events-none mt-0' : 'hidden'}`}
            >
              <div className="overflow-hidden">
                <div className="border border-outline/20 bg-[#f5f5f3] p-5 space-y-4">
                  <p className="font-serif italic text-xs text-on-surface font-medium leading-relaxed">
                    Please leave your nail measurements here if choosing a custom size
                  </p>
                  <textarea
                    id="custom-size-note"
                    value={customSizeNote}
                    onChange={(e) => {
                      setCustomSizeNote(e.target.value)
                      if (customSizeError && e.target.value.trim()) {
                        setCustomSizeError('')
                      }
                    }}
                    placeholder="e.g. Thumb: 14mm, Index: 12mm, Middle: 13mm, Ring: 12mm, Pinky: 10mm"
                    rows={3}
                    className={`w-full bg-white border px-4 py-3 font-sans text-sm text-on-background placeholder:text-on-surface-variant/50 focus:outline-none transition-colors resize-none ${customSizeError ? 'border-red-500 focus:border-red-500' : 'border-outline/40 focus:border-on-background'}`}
                  />
                  {customSizeError && (
                    <p className="font-sans text-xs text-red-500 font-medium">{customSizeError}</p>
                  )}
                  {/* <p className="font-sans text-on-surface-variant leading-relaxed">
                    Measure the widest part of each nail bed in millimeters. This note will be attached to your order so we can craft your perfect fit.
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      <div className="mt-4">
        <AddToCartButton
          variant={isCustomSize
            ? /* For custom size, use the first available variant as the base product.
                 The custom sizing note is communicated via line item attributes,
                 not through the variant system. */
            product.variants.nodes.find(v => v.availableForSale) ?? selectedVariant
            : selectedVariant
          }
          attributes={lineAttributes}
          onValidate={isCustomSize ? validateCustomSize : undefined}
        />
      </div>

      {/* ── Shape & Size Guide Drawer ─────────────────────────────────────
          Images live in public/slideshapesize/ and are served statically.
          Sorted by filename: 1.png → 2.png → 3.png → 4.png              */}
      {(() => {
        const GUIDE_IMAGES = [
          { src: '/slideshapesize/1.png', alt: 'Shape & size guide — image 1' },
          { src: '/slideshapesize/2.png', alt: 'Shape & size guide — image 2' },
          { src: '/slideshapesize/3.png', alt: 'Shape & size guide — image 3' },
          { src: '/slideshapesize/4.png', alt: 'Shape & size guide — image 4' },
        ]
        return (
          <>
            {/* Backdrop — always rendered so opacity transition works */}
            <div
              aria-hidden="true"
              onClick={() => setIsShapeGuideOpen(false)}
              className={`fixed inset-0 z-[90] bg-black/50 transition-opacity duration-300
                ${isShapeGuideOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Drawer panel */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Shape and size guide"
              className={`fixed top-0 right-0 z-[100] h-full w-full sm:w-[420px] max-w-[100vw]
                bg-surface shadow-2xl flex flex-col
                transition-transform duration-300 ease-in-out
                ${isShapeGuideOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline/15 shrink-0">
                <h2 className="font-serif text-xl font-normal text-on-background tracking-wide">
                  Shape &amp; Size Guide
                </h2>
                <button
                  type="button"
                  aria-label="Close shape and size guide"
                  onClick={() => setIsShapeGuideOpen(false)}
                  className="p-1.5 text-on-surface-variant hover:text-on-background transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Scrollable image list */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
                {GUIDE_IMAGES.map((img) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto object-contain block"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </>
        )
      })()}
    </div>
  )
}
