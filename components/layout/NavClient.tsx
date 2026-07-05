'use client'
// components/layout/NavClient.tsx
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import HomeLink from './HomeLink'

interface CollectionItem {
  id: string
  title: string
  handle: string
}

interface NavClientProps {
  initialCollections?: CollectionItem[]
}

const UI_TEXT = {
  home: "Home",
  shop: "Shop",
  ourStory: "Our Story",
  contact: "Contact",
  close: "Close Menu",
  
  // Column 1: Press-on Nails
  pressOnNails: "Press-on Nails",
  allNails: "All Nails",
  newArrivals: "New Arrivals",
  bestSellers: "Best Sellers",
  prepKits: "Prep Kits & Tools",
  onSale: "On Sale",
  
  // Column 2: Shop by Shape
  shopByShape: "Shop by Shape",
  almond: "Almond",
  coffin: "Coffin",
  stiletto: "Stiletto",
  round: "Round",
  square: "Square",
  oval: "Oval",
  
  // Column 3: Shop by Length
  shopByLength: "Shop by Length",
  ultraShort: "Ultra-Short",
  short: "Short",
  medium: "Medium",
  long: "Long",
  
  // Column 4: Collections
  collections: "Collections",
  noCollections: "New arrivals coming soon.",
}

// Grouping keywords map (for filtering Column 4 custom collections)
const SHAPE_HANDLES = ['almond', 'coffin', 'stiletto', 'round', 'square', 'oval']
const LENGTH_HANDLES = ['ultra-short', 'short', 'medium', 'long']
const GENERAL_HANDLES = ['all', 'new-arrivals', 'best-sellers', 'sale', 'tools', 'prep-kits', 'all-nails']

export default function NavClient({ initialCollections = [] }: NavClientProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  const [menuOpen, setMenuOpen] = useState(false)
  const { cart, openCart } = useCart()
  const [isBouncing, setIsBouncing] = useState(false)

  // Desktop Hover Menu State
  const [isShopOpen, setIsShopOpen] = useState(false)

  // Mobile Drawer Accordion State
  const [mobileShopOpen, setMobileShopOpen] = useState(false)
  const [mobileActiveSub, setMobileActiveSub] = useState<Record<string, boolean>>({
    nails: false,
    shape: false,
    length: false,
    collections: false,
  })

  // Search Toggle State
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  function toggleMobileSub(key: string) {
    setMobileActiveSub((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchInput(false)
      setSearchQuery('')
    }
  }

  // Column 4 dynamic filter: exclude standard tags so they don't overlap with static sections
  const customCollections = initialCollections.filter(c => 
    !SHAPE_HANDLES.includes(c.handle.toLowerCase()) &&
    !LENGTH_HANDLES.includes(c.handle.toLowerCase()) &&
    !GENERAL_HANDLES.includes(c.handle.toLowerCase())
  )

  const totalQuantity = cart?.totalQuantity || 0

  // Trigger a brief animation when totalQuantity increases
  useEffect(() => {
    if (totalQuantity > 0) {
      setIsBouncing(true)
      const timer = setTimeout(() => setIsBouncing(false), 300)
      return () => clearTimeout(timer)
    }
  }, [totalQuantity])

  return (
    <>
      {/* ── DESKTOP NAVIGATION LINKS (Center-Aligned) ───────────────────────── */}
      <div 
        className="hidden md:flex items-center gap-10 lg:gap-12 absolute left-1/2 -translate-x-1/2 h-full top-0 text-on-surface-variant z-40 text-label"
        onMouseLeave={() => setIsShopOpen(false)}
      >
        <HomeLink 
          href={`/${locale}`} 
          className="hover:text-on-background transition-colors duration-200 py-5"
        >
          {UI_TEXT.home}
        </HomeLink>
        
        <div 
          className="h-full flex items-center"
          onMouseEnter={() => setIsShopOpen(true)}
        >
          <Link 
            href={`/${locale}/collections`} 
            className="hover:text-on-background transition-colors duration-200 py-5 flex items-center gap-1 cursor-pointer"
          >
            {UI_TEXT.shop}
            <span className="material-symbols-outlined font-bold select-none">
              expand_more
            </span>
          </Link>
        </div>

        <Link 
          href={`/${locale}/about`} 
          className="hover:text-on-background transition-colors duration-200 py-5"
        >
          {UI_TEXT.ourStory}
        </Link>

        <Link 
          href={`/${locale}/contact`} 
          className="hover:text-on-background transition-colors duration-200 py-5"
        >
          {UI_TEXT.contact}
        </Link>

        {/* Desktop Dropdown Mega Menu Panel (Grid matrix) */}
        {isShopOpen && (
          <div 
            className="absolute top-full left-1/2 -translate-x-1/2 w-screen bg-surface border-b border-outline-variant/15 shadow-ambient py-12 animate-fade-in z-50 text-left cursor-default"
            onMouseEnter={() => setIsShopOpen(true)}
            onMouseLeave={() => setIsShopOpen(false)}
          >
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-4 gap-8 lg:gap-12">
              
              {/* Column 1: Press-on Nails (Static semantic URLs) */}
              <div className="min-w-[180px]">
                <span className="text-on-background font-bold mb-5 block text-label">
                  {UI_TEXT.pressOnNails}
                </span>
                <div className="flex flex-col gap-2.5">
                  <Link href={`/${locale}/collections/all`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.allNails}
                  </Link>
                  <Link href={`/${locale}/collections/new-arrivals`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.newArrivals}
                  </Link>
                  <Link href={`/${locale}/collections/best-sellers`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.bestSellers}
                  </Link>
                  <Link href={`/${locale}/collections/prep-kits`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.prepKits}
                  </Link>
                  <Link href={`/${locale}/collections/sale`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.onSale}
                  </Link>
                </div>
              </div>

              {/* Column 2: Shop by Shape (Static semantic URLs) */}
              <div className="min-w-[180px]">
                <span className="text-on-background font-bold mb-5 block text-label">
                  {UI_TEXT.shopByShape}
                </span>
                <div className="flex flex-col gap-2.5">
                  <Link href={`/${locale}/collections/almond`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.almond}
                  </Link>
                  <Link href={`/${locale}/collections/coffin`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.coffin}
                  </Link>
                  <Link href={`/${locale}/collections/stiletto`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.stiletto}
                  </Link>
                  <Link href={`/${locale}/collections/round`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.round}
                  </Link>
                  <Link href={`/${locale}/collections/square`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.square}
                  </Link>
                  <Link href={`/${locale}/collections/oval`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.oval}
                  </Link>
                </div>
              </div>

              {/* Column 3: Shop by Length (Static semantic URLs) */}
              <div className="min-w-[180px]">
                <span className="text-on-background font-bold mb-5 block text-label">
                  {UI_TEXT.shopByLength}
                </span>
                <div className="flex flex-col gap-2.5">
                  <Link href={`/${locale}/collections/ultra-short`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.ultraShort}
                  </Link>
                  <Link href={`/${locale}/collections/short`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.short}
                  </Link>
                  <Link href={`/${locale}/collections/medium`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.medium}
                  </Link>
                  <Link href={`/${locale}/collections/long`} className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1">
                    {UI_TEXT.long}
                  </Link>
                </div>
              </div>

              {/* Column 4: Collections (Strictly Dynamic custom lists) */}
              <div className="min-w-[180px]">
                <span className="text-on-background font-bold mb-5 block text-label">
                  {UI_TEXT.collections}
                </span>
                <div className="flex flex-col gap-2.5">
                  {customCollections.length > 0 ? (
                    customCollections.map((col) => (
                      <Link 
                        key={col.id} 
                        href={`/${locale}/collections/${col.handle}`} 
                        className="font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1 block"
                      >
                        {col.title}
                      </Link>
                    ))
                  ) : (
                    <span className="text-on-surface-variant/50 italic py-1 block text-caption">
                      {UI_TEXT.noCollections}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── STANDARD NAVIGATION ACTIONS (Search, Cart, Mobile Menu) ────────── */}
      <div className="flex items-center gap-6 text-on-surface-variant">
        {showSearchInput ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 border-b border-outline/35 py-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-on-background focus:ring-0 outline-none text-xs w-28 sm:w-40"
              autoFocus
            />
            <button type="submit" aria-label="Submit Search" className="hover:text-on-background transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
            <button type="button" onClick={() => setShowSearchInput(false)} aria-label="Close Search" className="hover:text-on-background transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowSearchInput(true)}
            aria-label="search"
            className="hover:text-on-background transition-all duration-200 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
        )}

        <button
          id="cart-icon-btn"
          aria-label={`Cart (${totalQuantity} items)`}
          onClick={openCart}
          className="hover:text-on-background transition-all duration-200 relative flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[20px] transition-colors">shopping_bag</span>
          {totalQuantity > 0 && (
            <span className={`absolute -right-2.5 -top-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 font-bold text-white transition-transform duration-300 ${isBouncing ? 'scale-125' : 'scale-100'}`}>
              {totalQuantity}
            </span>
          )}
        </button>

        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 text-on-surface-variant hover:text-on-background"
        >
          <span className="material-symbols-outlined text-[20px]">{menuOpen ? 'close' : 'menu'}</span>
        </button>

        {/* ── MOBILE NAVIGATION DRAWER (No Backdrop Blur, Solid Performance) ── */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 transition-opacity"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Drawer Panel */}
            <div className="relative w-4/5 max-w-sm bg-surface h-full shadow-2xl flex flex-col p-8 z-10 overflow-y-auto">
              <div className="flex justify-between items-center mb-10 shrink-0">
                <Image
                  src="/logo.png"
                  alt="nailestial"
                  width={140}
                  height={36}
                  className="h-7 w-auto object-contain"
                />
                <button
                  aria-label={UI_TEXT.close}
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-on-surface-variant hover:text-on-background"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Mobile Menu Options */}
              <div className="flex flex-col gap-6 text-left">
                
                {/* 1. HOME */}
                <HomeLink
                  href={`/${locale}`}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-3xl text-on-background hover:text-on-surface-variant transition-colors"
                >
                  {UI_TEXT.home}
                </HomeLink>

                {/* 2. SHOP (Accordion) */}
                <div className="border-b border-outline-variant/10 pb-4">
                  <button
                    onClick={() => setMobileShopOpen((v) => !v)}
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                  >
                    <span className="font-serif text-3xl text-on-background">
                      {UI_TEXT.shop}
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant transition-transform select-none">
                      {mobileShopOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {mobileShopOpen && (
                    <div className="mt-4 pl-4 space-y-4 animate-fade-in">
                      
                      {/* Sub-Accordion: Press-on Nails (Static links) */}
                      <div>
                        <button
                          onClick={() => toggleMobileSub('nails')}
                          className="w-full py-2 flex justify-between items-center text-left"
                        >
                          <span className="text-xs text-on-surface font-semibold text-label">
                            {UI_TEXT.pressOnNails}
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 select-none">
                            {mobileActiveSub.nails ? 'remove' : 'add'}
                          </span>
                        </button>
                        {mobileActiveSub.nails && (
                          <div className="pl-3 py-2 flex flex-col gap-3 border-l border-outline-variant/15 animate-fade-in">
                            <Link href={`/${locale}/collections/all`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.allNails}
                            </Link>
                            <Link href={`/${locale}/collections/new-arrivals`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.newArrivals}
                            </Link>
                            <Link href={`/${locale}/collections/best-sellers`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.bestSellers}
                            </Link>
                            <Link href={`/${locale}/collections/prep-kits`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.prepKits}
                            </Link>
                            <Link href={`/${locale}/collections/sale`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.onSale}
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Sub-Accordion: Shop by Shape (Static links) */}
                      <div>
                        <button
                          onClick={() => toggleMobileSub('shape')}
                          className="w-full py-2 flex justify-between items-center text-left"
                        >
                          <span className="text-xs text-on-surface font-semibold text-label">
                            {UI_TEXT.shopByShape}
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 select-none">
                            {mobileActiveSub.shape ? 'remove' : 'add'}
                          </span>
                        </button>
                        {mobileActiveSub.shape && (
                          <div className="pl-3 py-2 flex flex-col gap-3 border-l border-outline-variant/15 animate-fade-in">
                            <Link href={`/${locale}/collections/almond`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.almond}
                            </Link>
                            <Link href={`/${locale}/collections/coffin`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.coffin}
                            </Link>
                            <Link href={`/${locale}/collections/stiletto`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.stiletto}
                            </Link>
                            <Link href={`/${locale}/collections/round`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.round}
                            </Link>
                            <Link href={`/${locale}/collections/square`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.square}
                            </Link>
                            <Link href={`/${locale}/collections/oval`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.oval}
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Sub-Accordion: Shop by Length (Static links) */}
                      <div>
                        <button
                          onClick={() => toggleMobileSub('length')}
                          className="w-full py-2 flex justify-between items-center text-left"
                        >
                          <span className="text-xs text-on-surface font-semibold text-label">
                            {UI_TEXT.shopByLength}
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 select-none">
                            {mobileActiveSub.length ? 'remove' : 'add'}
                          </span>
                        </button>
                        {mobileActiveSub.length && (
                          <div className="pl-3 py-2 flex flex-col gap-3 border-l border-outline-variant/15 animate-fade-in">
                            <Link href={`/${locale}/collections/ultra-short`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.ultraShort}
                            </Link>
                            <Link href={`/${locale}/collections/short`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.short}
                            </Link>
                            <Link href={`/${locale}/collections/medium`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.medium}
                            </Link>
                            <Link href={`/${locale}/collections/long`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.long}
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Sub-Accordion: Collections (Dynamic links) */}
                      <div>
                        <button
                          onClick={() => toggleMobileSub('collections')}
                          className="w-full py-2 flex justify-between items-center text-left"
                        >
                          <span className="text-xs text-on-surface font-semibold text-label">
                            {UI_TEXT.collections}
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 select-none">
                            {mobileActiveSub.collections ? 'remove' : 'add'}
                          </span>
                        </button>
                        {mobileActiveSub.collections && (
                          <div className="pl-3 py-2 flex flex-col gap-3 border-l border-outline-variant/15 animate-fade-in">
                            {customCollections.length > 0 ? (
                              customCollections.map((col) => (
                                <Link 
                                  key={col.id} 
                                  href={`/${locale}/collections/${col.handle}`} 
                                  onClick={() => setMenuOpen(false)} 
                                  className="font-sans text-xs text-on-surface-variant"
                                >
                                  {col.title}
                                </Link>
                              ))
                            ) : (
                              <span className="text-on-surface-variant/50 italic py-1 block text-caption">
                                {UI_TEXT.noCollections}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>

                {/* 3. OUR STORY */}
                <Link
                  href={`/${locale}/about`}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-3xl text-on-background hover:text-on-surface-variant transition-colors"
                >
                  {UI_TEXT.ourStory}
                </Link>

                {/* 4. CONTACT */}
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-3xl text-on-background hover:text-on-surface-variant transition-colors"
                >
                  {UI_TEXT.contact}
                </Link>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
