'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import shopifyLoader from '@/lib/shopify/image-loader'
import Link from 'next/link'
import { getPredictiveSearch, type PredictiveSearchResult } from '@/lib/actions/search'
import { formatPrice } from '@/lib/currency'

interface PredictiveSearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  locale: string
  initialQuery?: string
}

export default function PredictiveSearchOverlay({ isOpen, onClose, locale, initialQuery = '' }: PredictiveSearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<PredictiveSearchResult | null>(null)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Sync initial query when opened
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(initialQuery)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDebouncedQuery(initialQuery)
    }
  }, [isOpen, initialQuery])

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      
      // Basic focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    
    // Auto-focus input on open
    setTimeout(() => inputRef.current?.focus(), 100)
    
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(handler)
  }, [query])

  // Fetch results
  useEffect(() => {
    let isMounted = true
    if (!debouncedQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults(null)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false)
      return
    }

    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const res = await getPredictiveSearch(debouncedQuery, locale)
        if (isMounted) setResults(res)
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchResults()
    
    return () => {
      isMounted = false
    }
  }, [debouncedQuery, locale])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onClose()
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  if (!isOpen || !mounted) return null

  const hasProducts = results && results.products.length > 0
  const hasCollections = results && results.collections.length > 0
  const isEmpty = results && !hasProducts && !hasCollections

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Predictive Search"
      className="fixed inset-0 z-50 flex flex-col items-center pt-0 md:pt-[10vh]"
      ref={dialogRef}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog content */}
      <div className="relative w-full h-full md:h-auto md:max-w-4xl bg-surface md:shadow-ambient flex flex-col md:rounded-b-none overflow-hidden animate-fade-in">
        
        {/* Header / Input */}
        <div className="px-6 py-6 border-b border-outline-variant/15 flex items-center gap-4 shrink-0 bg-surface">
          <form onSubmit={handleSubmit} className="flex-1 flex items-center relative">
            <span className="material-symbols-outlined text-[24px] text-on-surface-variant absolute left-0 pointer-events-none">search</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, collections..."
              className="w-full bg-transparent border-none text-xl md:text-2xl text-on-background focus:ring-0 pl-10 pr-4 py-2 placeholder:text-on-surface-variant/40 outline-none"
              aria-label="Search query"
            />
          </form>
          <button 
            onClick={onClose}
            aria-label="Close search"
            className="text-on-surface-variant hover:text-on-background transition-colors p-2"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto bg-surface" aria-live="polite">
          {isLoading && (
            <div className="p-12 flex justify-center items-center">
              <span className="text-on-surface-variant text-sm tracking-wider uppercase">Loading...</span>
            </div>
          )}

          {!isLoading && !results && !query && (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30 mb-3">search</span>
              <p className="text-on-surface-variant text-sm">Start typing to search for products and collections.</p>
            </div>
          )}

          {!isLoading && isEmpty && query && (
            <div className="p-12 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30 mb-3">search_off</span>
              <h3 className="font-serif text-2xl text-on-background mb-2">No suggestions found</h3>
              <p className="text-on-surface-variant text-sm mb-6">We couldn&apos;t find anything matching &quot;{query}&quot;.</p>
              <button 
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/85 transition-colors"
              >
                View all results
              </button>
            </div>
          )}

          {!isLoading && results && !isEmpty && (
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-10 md:gap-16">
              
              {/* Keyword / Collection Suggestions */}
              {hasCollections && (
                <div className="md:w-1/3 shrink-0">
                  <h3 className="text-sm uppercase tracking-wider text-on-surface-variant mb-4 font-bold">Suggestions</h3>
                  <div className="flex flex-col gap-3">
                    {results.collections.map(col => (
                      <Link
                        key={col.id}
                        href={`/${locale}/collections/${col.handle}`}
                        onClick={onClose}
                        className="text-on-background hover:text-on-surface-variant transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px] opacity-50">search</span>
                        {col.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Suggestions */}
              {hasProducts && (
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-sm uppercase tracking-wider text-on-surface-variant font-bold">Products</h3>
                    <button 
                      onClick={handleSubmit}
                      className="text-sm uppercase tracking-wider text-on-background hover:text-on-surface-variant transition-colors underline underline-offset-4"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {results.products.map(product => {
                      const image = product.images?.nodes?.[0]
                      return (
                        <Link 
                          key={product.id}
                          href={`/${locale}/products/${product.handle}`}
                          onClick={onClose}
                          className="group flex flex-col gap-3"
                        >
                          <div className="w-full aspect-square bg-surface-variant relative overflow-hidden">
                            {image && (
                              <Image 
                                src={image.url}
                                loader={shopifyLoader}
                                alt={image.altText || product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 50vw, 25vw"
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="font-serif text-lg leading-tight text-on-background group-hover:text-on-surface-variant transition-colors mb-1">{product.title}</h4>
                            <p className="text-sm text-on-surface-variant">{formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode, locale)}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer actions for mobile */}
        {query && !isEmpty && !isLoading && (
          <div className="md:hidden border-t border-outline-variant/15 p-4 bg-surface shrink-0">
            <button 
              onClick={handleSubmit}
              className="w-full py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/85 transition-colors"
            >
              View all results for &quot;{query}&quot;
            </button>
          </div>
        )}

      </div>
    </div>,
    document.body
  )
}
