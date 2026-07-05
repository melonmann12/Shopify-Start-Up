'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface CollectionItem {
  id: string
  title: string
  handle: string
}

interface SearchClientProps {
  products: ShopifyProduct[]
  collections: CollectionItem[]
  productTypes: string[]
  locale: string
  currentParams: {
    q: string
    sort: string
    collection: string
    available: string
    product_type: string
  }
}

export default function SearchClient({
  products,
  collections,
  productTypes,
  locale,
  currentParams,
}: SearchClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  // Client states
  const [searchInput, setSearchInput] = useState(currentParams.q)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Centralized URL state update function
  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl({ q: searchInput || null })
  }

  const handleClearFilters = () => {
    setSearchInput('')
    router.push(pathname)
  }

  const hasActiveFilters = 
    currentParams.collection || 
    currentParams.available === 'true' || 
    currentParams.product_type

  return (
    <div className="w-full">
      {/* ── Search Bar Input ── */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mb-12 relative flex items-center">
        <input
          type="text"
          placeholder="Search items..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-transparent border-b border-outline/35 py-4 px-2 text-on-background focus:outline-none focus:border-on-background transition-colors placeholder:text-on-surface-variant/40"
        />
        <button type="submit" aria-label="Search" className="absolute right-2 text-on-surface-variant hover:text-on-background transition-colors">
          <span className="material-symbols-outlined text-[24px]">search</span>
        </button>
      </form>

      {/* ── Filter Controls Header ── */}
      <div className="flex justify-between items-center border-b border-outline-variant/15 pb-6 mb-8 text-label">
        <div className="flex items-center gap-4">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-outline/30 rounded-full hover:border-on-background transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
          
          <span className="text-on-surface-variant text-[11px]">
            {products.length} {products.length === 1 ? 'result' : 'results'} found
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-on-surface-variant">Sort by:</span>
          <select
            value={currentParams.sort}
            onChange={(e) => updateUrl({ sort: e.target.value })}
            className="bg-transparent border-none text-on-background text-[11px] uppercase tracking-wider focus:ring-0 outline-none cursor-pointer pr-8"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">A-Z</option>
          </select>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        
        {/* ── Sidebar Filters (Desktop) ── */}
        <aside className="hidden md:block w-64 shrink-0 text-left">
          <div className="space-y-8">
            
            {/* Filter Group: Collections */}
            <div>
              <h3 className="font-bold mb-4 text-label text-on-background">Collections</h3>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => updateUrl({ collection: null })}
                  className={`text-xs text-left transition-colors ${!currentParams.collection ? 'text-on-background font-semibold' : 'text-on-surface-variant hover:text-on-background'}`}
                >
                  All Collections
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => updateUrl({ collection: col.handle })}
                    className={`text-xs text-left transition-colors ${currentParams.collection === col.handle ? 'text-on-background font-semibold' : 'text-on-surface-variant hover:text-on-background'}`}
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group: Product Types */}
            {productTypes.length > 0 && (
              <div>
                <h3 className="font-bold mb-4 text-label text-on-background">Product Type</h3>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => updateUrl({ product_type: null })}
                    className={`text-xs text-left transition-colors ${!currentParams.product_type ? 'text-on-background font-semibold' : 'text-on-surface-variant hover:text-on-background'}`}
                  >
                    All Types
                  </button>
                  {productTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => updateUrl({ product_type: type })}
                      className={`text-xs text-left transition-colors ${currentParams.product_type === type ? 'text-on-background font-semibold' : 'text-on-surface-variant hover:text-on-background'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Group: Availability */}
            <div>
              <h3 className="font-bold mb-4 text-label text-on-background">Availability</h3>
              <label className="flex items-center gap-3 cursor-pointer text-xs text-on-surface-variant hover:text-on-background select-none">
                <input
                  type="checkbox"
                  checked={currentParams.available === 'true'}
                  onChange={(e) => updateUrl({ available: e.target.checked ? 'true' : null })}
                  className="rounded border-outline/30 text-black focus:ring-black h-4 w-4 accent-black"
                />
                In-Stock Only
              </label>
            </div>

            {/* Clear All Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="w-full text-center py-2.5 border border-on-background hover:bg-on-background hover:text-white transition-colors text-label rounded-none mt-4"
              >
                Clear Filters
              </button>
            )}

          </div>
        </aside>

        {/* ── Product Grid or Empty State ── */}
        <div className="flex-1 w-full">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-outline-variant/15">
              {products.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  isPriority={idx < 6}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 px-4 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/45 mb-4 select-none">
                search_off
              </span>
              <h2 className="font-serif text-2xl text-on-background mb-3">No matches found</h2>
              <p className="text-on-surface-variant max-w-sm mb-8 text-caption">
                Try checking your spelling, simplifying keywords, or clear existing filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-8 py-3 bg-black text-white text-label hover:bg-black/85 transition-colors rounded-none"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── Mobile Filters Drawer Panel ── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/40 transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Body */}
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
              {/* Collection list */}
              <div>
                <h3 className="font-bold mb-3 text-label text-on-background">Collections</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { updateUrl({ collection: null }); setMobileFiltersOpen(false); }}
                    className={`text-xs text-left py-1 ${!currentParams.collection ? 'text-on-background font-semibold' : 'text-on-surface-variant'}`}
                  >
                    All Collections
                  </button>
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => { updateUrl({ collection: col.handle }); setMobileFiltersOpen(false); }}
                      className={`text-xs text-left py-1 ${currentParams.collection === col.handle ? 'text-on-background font-semibold' : 'text-on-surface-variant'}`}
                    >
                      {col.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product types */}
              {productTypes.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 text-label text-on-background">Product Type</h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { updateUrl({ product_type: null }); setMobileFiltersOpen(false); }}
                      className={`text-xs text-left py-1 ${!currentParams.product_type ? 'text-on-background font-semibold' : 'text-on-surface-variant'}`}
                    >
                      All Types
                    </button>
                    {productTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => { updateUrl({ product_type: type }); setMobileFiltersOpen(false); }}
                        className={`text-xs text-left py-1 ${currentParams.product_type === type ? 'text-on-background font-semibold' : 'text-on-surface-variant'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability checkbox */}
              <div>
                <h3 className="font-bold mb-3 text-label text-on-background">Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer text-xs text-on-surface-variant py-1">
                  <input
                    type="checkbox"
                    checked={currentParams.available === 'true'}
                    onChange={(e) => {
                      updateUrl({ available: e.target.checked ? 'true' : null })
                      setMobileFiltersOpen(false)
                    }}
                    className="rounded border-outline/30 text-black focus:ring-black h-4 w-4"
                  />
                  In-Stock Only
                </label>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => { handleClearFilters(); setMobileFiltersOpen(false); }}
                className="w-full text-center py-3 border border-on-background hover:bg-on-background hover:text-white transition-colors text-label rounded-none shrink-0 mt-8"
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
