'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function FilterSortBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || 'newest'

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', e.target.value)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="max-w-[1920px] mx-auto px-8 md:px-16 py-8 flex flex-col md:flex-row justify-between items-center border-b border-surface-container-highest/50 gap-4">
      <button className="flex items-center gap-2 bg-surface-container-highest text-on-surface px-6 py-3 rounded-full hover:bg-surface-variant transition-colors font-body text-sm font-medium">
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>tune</span>
        Filter
      </button>

      <div className="flex items-center gap-3">
        <span className="font-body text-sm text-on-surface-variant">Sort by:</span>
        <select 
          value={currentSort}
          onChange={handleSortChange}
          className="bg-transparent border-none text-on-surface font-headline text-sm font-semibold focus:ring-0 cursor-pointer pr-8 py-2"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  )
}
