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

// ─── UI strings ─────────────────────────────────────────────────────────────
const UI_TEXT = {
  home: 'Home',
  shop: 'Shop',
  ourStory: 'Our Story',
  contact: 'Contact',
  closeMenu: 'Close Menu',

  // Column 1: Press-on Nails
  // These are intentionally static: they map to semantic Shopify collection handles
  // that the store team creates once and keeps stable. Make dynamic when Shopify
  // navigation menus / metaobjects are configured for this storefront.
  pressOnNails: 'Press-on Nails',
  allNails: 'All Nails',
  newArrivals: 'New Arrivals',
  bestSellers: 'Best Sellers',
  onSale: 'On Sale',

  // Column 2: Collections (rendered dynamically from Shopify)
  collections: 'Collections',
  noCollections: 'Collections coming soon.',

  // Column 3: Order Tracking (placeholder — backend not yet implemented)
  orderTracking: 'Order Tracking',
  trackOrder: 'Track your order',
  shippingPolicy: 'Shipping policy',
  returnsExchanges: 'Returns & exchanges',
}

// Handles to exclude from the dynamic Collections column so they don't clash
// with the curated Press-on Nails links above or Shopify's internal defaults.
const EXCLUDED_HANDLES = new Set([
  'frontpage',
  'all',
  'new-arrivals',
  'best-sellers',
  'sale',
  'tools',
  'prep-kits',
  'all-nails',
])
const EXCLUDED_TITLES = new Set(['Home page', 'Homepage', 'home page'])

export default function NavClient({ initialCollections = [] }: NavClientProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  const [menuOpen, setMenuOpen] = useState(false)
  const { cart, openCart } = useCart()
  const [isBouncing, setIsBouncing] = useState(false)

  // Desktop hover mega menu
  const [isShopOpen, setIsShopOpen] = useState(false)

  // Mobile drawer accordion
  const [mobileShopOpen, setMobileShopOpen] = useState(false)
  const [mobileActiveSub, setMobileActiveSub] = useState<Record<string, boolean>>({
    nails: false,
    collections: false,
    tracking: false,
  })

  // Search
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

  // Filter out internal/default Shopify collections from the dynamic column
  const displayCollections = initialCollections.filter(
    (c) =>
      !EXCLUDED_HANDLES.has(c.handle.toLowerCase()) &&
      !EXCLUDED_TITLES.has(c.title)
  )

  const totalQuantity = cart?.totalQuantity || 0

  useEffect(() => {
    if (totalQuantity > 0) {
      setIsBouncing(true)
      const timer = setTimeout(() => setIsBouncing(false), 300)
      return () => clearTimeout(timer)
    }
  }, [totalQuantity])

  // Shared link classes
  const menuLinkCls =
    'font-sans text-xs text-on-surface-variant hover:text-on-background transition-colors py-1'

  return (
    <>
      {/* ── DESKTOP NAVIGATION LINKS ──────────────────────────────────────── */}
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

        {/* ── DESKTOP MEGA MENU PANEL (3 columns) ─────────────────────────── */}
        {isShopOpen && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-screen bg-surface border-b border-outline-variant/15 shadow-ambient py-12 animate-fade-in z-50 text-left cursor-default"
            onMouseEnter={() => setIsShopOpen(true)}
            onMouseLeave={() => setIsShopOpen(false)}
          >
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-3 gap-8 lg:gap-16">

              {/* ── Column 1: Press-on Nails ─────────────────────────────── */}
              {/* Intentionally static: these map to stable Shopify collection handles.
                  To make fully dynamic, configure a Shopify navigation menu or metaobject
                  with handle "press-on-nails-menu" and fetch it via the Storefront API. */}
              <div>
                <span className="text-on-background font-bold mb-5 block text-label">
                  {UI_TEXT.pressOnNails}
                </span>
                <div className="flex flex-col gap-2.5">
                  <Link href={`/${locale}/collections/all`} className={menuLinkCls}>
                    {UI_TEXT.allNails}
                  </Link>
                  <Link href={`/${locale}/collections/new-arrivals`} className={menuLinkCls}>
                    {UI_TEXT.newArrivals}
                  </Link>
                  <Link href={`/${locale}/collections/best-sellers`} className={menuLinkCls}>
                    {UI_TEXT.bestSellers}
                  </Link>
                  <Link href={`/${locale}/collections/sale`} className={menuLinkCls}>
                    {UI_TEXT.onSale}
                  </Link>
                </div>
              </div>

              {/* ── Column 2: Collections (dynamic from Shopify) ─────────── */}
              <div>
                <span className="text-on-background font-bold mb-5 block text-label">
                  {UI_TEXT.collections}
                </span>
                <div className="flex flex-col gap-2.5">
                  {displayCollections.length > 0 ? (
                    displayCollections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/${locale}/collections/${col.handle}`}
                        className={menuLinkCls}
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

              {/* ── Column 3: Order Tracking (placeholder) ───────────────── */}
              {/* Backend order tracking is not yet implemented.
                  Link /track-order to a placeholder page or Shopify's order status URL
                  once the integration is ready. Policy links route to /policies/[handle]. */}
              <div>
                <span className="text-on-background font-bold mb-5 block text-label">
                  {UI_TEXT.orderTracking}
                </span>
                <div className="flex flex-col gap-2.5">
                  <Link
                    href={`/${locale}/contact`}
                    className={menuLinkCls}
                    title="Order tracking coming soon — contact us for updates"
                  >
                    {UI_TEXT.trackOrder}
                    <span className="ml-1.5 text-[10px] text-on-surface-variant/40 italic">
                      (coming soon)
                    </span>
                  </Link>
                  <Link href={`/${locale}/policies/shipping-policy`} className={menuLinkCls}>
                    {UI_TEXT.shippingPolicy}
                  </Link>
                  <Link href={`/${locale}/policies/refund-policy`} className={menuLinkCls}>
                    {UI_TEXT.returnsExchanges}
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── STANDARD ACTIONS (Search, Cart, Mobile Menu) ─────────────────── */}
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
            <span
              className={`absolute -right-2.5 -top-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 font-bold text-white transition-transform duration-300 ${
                isBouncing ? 'scale-125' : 'scale-100'
              }`}
            >
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

        {/* ── MOBILE NAVIGATION DRAWER ─────────────────────────────────────── */}
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
                  aria-label={UI_TEXT.closeMenu}
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-on-surface-variant hover:text-on-background"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-6 text-left">

                {/* HOME */}
                <HomeLink
                  href={`/${locale}`}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-3xl text-on-background hover:text-on-surface-variant transition-colors"
                >
                  {UI_TEXT.home}
                </HomeLink>

                {/* SHOP (accordion) */}
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

                      {/* Sub-accordion: Press-on Nails */}
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
                            <Link href={`/${locale}/collections/sale`} onClick={() => setMenuOpen(false)} className="font-sans text-xs text-on-surface-variant">
                              {UI_TEXT.onSale}
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Sub-accordion: Collections (dynamic) */}
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
                            {displayCollections.length > 0 ? (
                              displayCollections.map((col) => (
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
                              <span className="text-on-surface-variant/50 italic text-caption">
                                {UI_TEXT.noCollections}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Sub-accordion: Order Tracking (placeholder) */}
                      <div>
                        <button
                          onClick={() => toggleMobileSub('tracking')}
                          className="w-full py-2 flex justify-between items-center text-left"
                        >
                          <span className="text-xs text-on-surface font-semibold text-label">
                            {UI_TEXT.orderTracking}
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/65 select-none">
                            {mobileActiveSub.tracking ? 'remove' : 'add'}
                          </span>
                        </button>
                        {mobileActiveSub.tracking && (
                          <div className="pl-3 py-2 flex flex-col gap-3 border-l border-outline-variant/15 animate-fade-in">
                            <Link
                              href={`/${locale}/contact`}
                              onClick={() => setMenuOpen(false)}
                              className="font-sans text-xs text-on-surface-variant"
                            >
                              {UI_TEXT.trackOrder}{' '}
                              <span className="text-[10px] italic text-on-surface-variant/40">(coming soon)</span>
                            </Link>
                            <Link
                              href={`/${locale}/policies/shipping-policy`}
                              onClick={() => setMenuOpen(false)}
                              className="font-sans text-xs text-on-surface-variant"
                            >
                              {UI_TEXT.shippingPolicy}
                            </Link>
                            <Link
                              href={`/${locale}/policies/refund-policy`}
                              onClick={() => setMenuOpen(false)}
                              className="font-sans text-xs text-on-surface-variant"
                            >
                              {UI_TEXT.returnsExchanges}
                            </Link>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>

                {/* OUR STORY */}
                <Link
                  href={`/${locale}/about`}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-3xl text-on-background hover:text-on-surface-variant transition-colors"
                >
                  {UI_TEXT.ourStory}
                </Link>

                {/* CONTACT */}
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
