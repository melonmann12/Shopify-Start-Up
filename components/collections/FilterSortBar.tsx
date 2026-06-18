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
    <div className="max-w-[1920px] mx-auto py-6 flex flex-row justify-between items-center border-b border-outline-variant/30 gap-4 mb-12 relative z-10">
      <button className="flex items-center gap-2 text-on-background font-mono text-[11px] uppercase tracking-[0.2em] hover:text-on-surface-variant transition-colors duration-200">
        <span className="material-symbols-outlined text-[16px]">tune</span>
        Filter
      </button>

      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-on-background">
        <span className="opacity-70">Sort by:</span>
        <select 
          value={currentSort}
          onChange={handleSortChange}
          className="bg-transparent border-none text-on-background font-mono text-[11px] uppercase tracking-[0.1em] focus:ring-0 cursor-pointer pr-6 py-1 outline-none"
        >
          <option value="newest" className="bg-surface text-on-background">Newest</option>
          <option value="price-asc" className="bg-surface text-on-background">Price: Low to High</option>
          <option value="price-desc" className="bg-surface text-on-background">Price: High to Low</option>
        </select>
      </div>
    </div>
  )
}
