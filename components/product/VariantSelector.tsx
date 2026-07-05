'use client'
// components/product/VariantSelector.tsx
import { useState } from 'react'
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
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [customSizeNote, setCustomSizeNote] = useState('')
  const [customSizeError, setCustomSizeError] = useState('')

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

  return (
    <div className="flex flex-col gap-10">
      {product.options.map((option) => {
        const isSize = option.name.toLowerCase() === 'size'
        const isColor = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour'

        // For the size option, append "Custom" only if not already in the source data
        const values = isSize && !option.values.includes(CUSTOM_SIZE_VALUE)
          ? [...option.values, CUSTOM_SIZE_VALUE]
          : option.values

        return (
          <div key={option.id}>
            <div className="mb-4 flex items-end justify-between">
              <span className="text-on-surface-variant text-label">
                Select {option.name}
              </span>
              {isSize && (
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="font-serif italic text-xs text-on-surface-variant hover:text-on-background underline decoration-outline-variant/30 hover:decoration-on-background underline-offset-4 transition-colors"
                >
                  Find your size
                </button>
              )}
            </div>

            <div className={isSize ? "grid grid-cols-4 sm:grid-cols-5 gap-3" : "flex gap-3 flex-wrap"}>
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
                      className={`w-12 h-8 transition-colors relative border duration-200 ${isSelected ? 'border-2 border-on-background' : 'border-outline/40 hover:border-on-background' } ${!available ? 'opacity-30 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: getColorHex(value) }}
                    >
                      <span className="sr-only">{value}</span>
                    </button>
                  )
                }

                // Size Selector / Text Swatches: Minimalist Outline Buttons
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
                    className={`py-3 transition-colors border duration-200 ${isSelected ? 'border-2 border-on-background bg-surface-container-lowest text-on-background font-bold' : available ? 'border border-outline/40 bg-transparent text-on-surface-variant hover:border-on-background hover:text-on-background' : 'border border-outline/20 bg-transparent text-on-surface-variant/40 cursor-not-allowed' } text-label`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>

            {/* Custom Size Note Input — revealed smoothly when "Custom" is selected */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${isSize ? isCustomSize ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0 pointer-events-none mt-0' : 'hidden' }`}
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
                    className={`w-full bg-white border px-4 py-3 font-sans text-sm text-on-background placeholder:text-on-surface-variant/50 focus:outline-none transition-colors resize-none ${customSizeError ? 'border-red-500 focus:border-red-500' : 'border-outline/40 focus:border-on-background' }`}
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

      {/* Premium Minimalist Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsSizeGuideOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Modal Panel */}
          <div className="bg-surface border border-outline/30 p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl flex flex-col">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-6 right-6 text-on-surface-variant hover:text-on-background transition-colors text-label"
            >
              Close
            </button>

            <h3 className="font-serif text-3xl font-normal text-on-background mb-2">Size Chart</h3>
            <p className="text-on-surface-variant mb-6 text-label">
              Standard Footwear Sizing
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-outline/20 text-caption">
                <thead>
                  <tr className="border-b border-outline/25 bg-surface-container-low">
                    <th className="p-3 font-bold uppercase">US</th>
                    <th className="p-3 font-bold uppercase">EU</th>
                    <th className="p-3 font-bold uppercase">UK</th>
                    <th className="p-3 font-bold uppercase">CM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/10 text-on-surface-variant">
                  <tr>
                    <td className="p-3">7.0</td>
                    <td className="p-3">40</td>
                    <td className="p-3">6.5</td>
                    <td className="p-3">25.0</td>
                  </tr>
                  <tr>
                    <td className="p-3">8.0</td>
                    <td className="p-3">41</td>
                    <td className="p-3">7.5</td>
                    <td className="p-3">26.0</td>
                  </tr>
                  <tr>
                    <td className="p-3">9.0</td>
                    <td className="p-3">42</td>
                    <td className="p-3">8.5</td>
                    <td className="p-3">27.0</td>
                  </tr>
                  <tr>
                    <td className="p-3">10.0</td>
                    <td className="p-3">43</td>
                    <td className="p-3">9.5</td>
                    <td className="p-3">28.0</td>
                  </tr>
                  <tr>
                    <td className="p-3">11.0</td>
                    <td className="p-3">44</td>
                    <td className="p-3">10.5</td>
                    <td className="p-3">29.0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="font-serif italic text-xs text-on-surface-variant mt-6 leading-relaxed">
              * Fit recommendation: If you are between sizes, we suggest taking the next size up for optimal comfort.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
