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

  return (
    <div className="flex flex-col gap-10">
      {product.options.map((option) => {
        const isSize = option.name.toLowerCase() === 'size'
        const isColor = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour'

        return (
          <div key={option.id}>
            <div className="mb-4 flex items-end justify-between">
              <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em]">
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
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value

                // Check whether this value is available in any variant
                const available = product.variants.nodes.some(
                  (v) =>
                    v.selectedOptions.some((o) => o.name === option.name && o.value === value) &&
                    v.availableForSale
                )

                if (isColor) {
                  // Color Selector: Minimalist Rectangles
                  return (
                    <button
                      key={value}
                      onClick={() => onSelectOption(option.name, value)}
                      disabled={!available}
                      title={value}
                      className={`w-12 h-8 transition-colors relative border duration-200 ${
                        isSelected
                          ? 'border-2 border-on-background'
                          : 'border-outline/40 hover:border-on-background'
                      } ${!available ? 'opacity-30 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: getColorHex(value) }}
                    >
                      <span className="sr-only">{value}</span>
                    </button>
                  )
                }

                // Size Selector / Text Swatches: Minimalist Outline Buttons
                return (
                  <button
                    key={value}
                    onClick={() => onSelectOption(option.name, value)}
                    disabled={!available}
                    className={`py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors border duration-200 ${
                      isSelected
                        ? 'border-2 border-on-background bg-surface-container-lowest text-on-background font-bold'
                        : available
                          ? 'border border-outline/40 bg-transparent text-on-surface-variant hover:border-on-background hover:text-on-background'
                          : 'border border-outline/20 bg-transparent text-on-surface-variant/40 cursor-not-allowed'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="mt-4">
        <AddToCartButton variant={selectedVariant} />
      </div>

      {/* Premium Minimalist Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsSizeGuideOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <div className="bg-surface border border-outline/30 p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl flex flex-col">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-background transition-colors"
            >
              Close
            </button>

            <h3 className="font-serif text-3xl font-normal text-on-background mb-2">Size Chart</h3>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.15em] mb-6">
              Standard Footwear Sizing
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] border-collapse border border-outline/20">
                <thead>
                  <tr className="border-b border-outline/25 bg-surface-container-low">
                    <th className="p-3 uppercase tracking-wider font-bold">US</th>
                    <th className="p-3 uppercase tracking-wider font-bold">EU</th>
                    <th className="p-3 uppercase tracking-wider font-bold">UK</th>
                    <th className="p-3 uppercase tracking-wider font-bold">CM</th>
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
