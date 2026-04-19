// hooks/useProductVariant.ts
'use client'

import { useState, useMemo } from 'react'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'

export function useProductVariant(product: ShopifyProduct) {
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

  function selectOption(name: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }))
  }

  return { selectedOptions, selectedVariant, selectOption }
}
