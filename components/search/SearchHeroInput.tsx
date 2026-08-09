'use client'

import { useSearch } from '@/components/search/SearchProvider'

export default function SearchHeroInput({ initialQuery }: { initialQuery: string }) {
  const { openSearch } = useSearch()
  
  return (
    <div className="w-full max-w-xl mx-auto mt-6 relative flex items-center">
      <button
        onClick={() => openSearch(initialQuery)}
        onFocus={() => openSearch(initialQuery)}
        aria-label="Open product search"
        className="w-full text-left bg-surface/70 backdrop-blur-md border border-outline/35 py-3.5 px-5 text-lg text-on-background focus:outline-none hover:bg-surface/90 transition-colors flex items-center rounded-full shadow-sm"
      >
        <span className="text-on-surface-variant flex-1 text-base">
          {initialQuery || 'Search items...'}
        </span>
        <span className="material-symbols-outlined text-[24px] text-on-surface-variant">search</span>
      </button>
    </div>
  )
}
