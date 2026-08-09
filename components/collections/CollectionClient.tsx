'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import type { ShopifyProduct, ShopifyFilter } from '@/lib/shopify/types'

interface CollectionClientProps {
  products: ShopifyProduct[]
  filters: ShopifyFilter[]
  locale: string
  currentSort: string
}

export default function CollectionClient({
  products,
  filters,
  locale,
  currentSort,
}: CollectionClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Get active filter inputs from URL
  const activeFilters = searchParams.getAll('f')

  const updateUrl = (newParams: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newParams).forEach(([key, value]) => {
      params.delete(key)
      if (value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v))
        } else {
          params.set(key, value)
        }
      }
    })

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const handleClearFilters = () => {
    updateUrl({ f: null })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrl({ sort: e.target.value })
  }

  const toggleFilter = (input: string) => {
    const isSelected = activeFilters.includes(input)
    const newFilters = isSelected
      ? activeFilters.filter((f) => f !== input)
      : [...activeFilters, input]
    
    updateUrl({ f: newFilters })
  }

  return (
    <div className="w-full">
      {/* ── Filter Controls Header ── */}
      <div className="flex justify-between items-center border-b border-outline-variant/30 pb-6 mb-8 text-label relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-outline/30 rounded-full hover:border-on-background transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
          
          <button 
            className="hidden md:flex items-center gap-2 text-on-background hover:text-on-surface-variant transition-colors duration-200 text-label cursor-default"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            Filters
          </button>
        </div>

        <div className="flex items-center gap-2 text-on-background text-label">
          <span className="hidden sm:inline opacity-70">Sort by:</span>
          <select 
            value={currentSort}
            onChange={handleSortChange}
            className="bg-transparent border-none text-on-background focus:ring-0 cursor-pointer pr-6 py-1 outline-none text-label"
          >
            <option value="newest" className="bg-surface text-on-background">Newest</option>
            <option value="price-asc" className="bg-surface text-on-background">Price: Low to High</option>
            <option value="price-desc" className="bg-surface text-on-background">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start relative z-10">
        
        {/* ── Sidebar Filters (Desktop) ── */}
        <aside className="hidden md:block w-56 shrink-0 text-left">
          <div className="space-y-8">
            {filters.map((filter) => {
              if (filter.values.length === 0) return null
              
              // Only render LIST types (like Color, Product Type, Availability)
              // We skip PRICE_RANGE for simplicity in this fashion layout unless requested.
              if (filter.type !== 'LIST') return null

              return (
                <div key={filter.id}>
                  <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-on-background">{filter.label}</h3>
                  <div className="flex flex-col gap-3">
                    {filter.values.map((val) => {
                      const isChecked = activeFilters.includes(val.input)
                      return (
                        <label
                          key={val.id}
                          className={`flex items-center gap-3 cursor-pointer text-sm select-none transition-colors ${val.count === 0 && !isChecked ? 'opacity-40 cursor-not-allowed' : 'text-on-surface-variant hover:text-on-background'}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={val.count === 0 && !isChecked}
                            onChange={() => toggleFilter(val.input)}
                            className="rounded border-outline/30 text-black focus:ring-black h-4 w-4 accent-black"
                          />
                          <span className={isChecked ? 'text-on-background font-semibold' : ''}>
                            {val.label} <span className="opacity-50 text-xs ml-1">({val.count})</span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {activeFilters.length > 0 && (
              <button
                onClick={handleClearFilters}
                className="w-full text-center py-2.5 border border-on-background hover:bg-on-background hover:text-white transition-colors text-sm uppercase tracking-wider rounded-none mt-4"
              >
                Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* ── Product Grid or Empty State ── */}
        <div className="flex-1 w-full">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-l border-on-background bg-surface/50 backdrop-blur-sm">
              {products.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  isPriority={idx < 8}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 px-4 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/45 mb-4 select-none">
                search_off
              </span>
              <h2 className="font-serif text-2xl text-on-background mb-3">No products found</h2>
              <p className="text-on-surface-variant max-w-sm mb-8 text-base">
                Try removing some filters to see more products.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-8 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/85 transition-colors rounded-none"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filters Drawer Panel ── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/40 transition-opacity"
            aria-hidden="true"
          />
          <div className="relative w-4/5 max-w-sm bg-surface h-full shadow-2xl flex flex-col p-8 z-10 overflow-y-auto text-left">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl text-on-background">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:text-on-background transition-colors text-on-surface-variant"
                aria-label="Close Filters"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-8 flex-1">
              {filters.map((filter) => {
                if (filter.values.length === 0 || filter.type !== 'LIST') return null
                return (
                  <div key={filter.id}>
                    <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-on-background">{filter.label}</h3>
                    <div className="flex flex-col gap-3">
                      {filter.values.map((val) => {
                        const isChecked = activeFilters.includes(val.input)
                        return (
                          <label
                            key={val.id}
                            className={`flex items-center gap-3 cursor-pointer text-sm select-none transition-colors py-1 ${val.count === 0 && !isChecked ? 'opacity-40 cursor-not-allowed' : 'text-on-surface-variant'}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={val.count === 0 && !isChecked}
                              onChange={() => toggleFilter(val.input)}
                              className="rounded border-outline/30 text-black focus:ring-black h-4 w-4"
                            />
                            <span className={isChecked ? 'text-on-background font-semibold' : ''}>
                              {val.label} <span className="opacity-50 text-xs ml-1">({val.count})</span>
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {activeFilters.length > 0 && (
              <button
                onClick={() => { handleClearFilters(); setMobileFiltersOpen(false); }}
                className="w-full text-center py-3 border border-on-background hover:bg-on-background hover:text-white transition-colors text-sm uppercase tracking-wider rounded-none shrink-0 mt-8"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
