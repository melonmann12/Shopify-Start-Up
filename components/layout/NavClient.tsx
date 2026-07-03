'use client'
// components/layout/NavClient.tsx
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'

const UI_TEXT = {
  collections: "Collections",
  newArrivals: "New Arrivals",
  ourStory: "Our Story",
  close: "Close Menu",
}

export default function NavClient() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cart, openCart } = useCart()
  const [isBouncing, setIsBouncing] = useState(false)

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
    <div className="flex items-center gap-6 text-on-surface-variant">
      <button aria-label="search" className="hover:text-on-background transition-all duration-200 flex items-center justify-center">
        <span className="material-symbols-outlined text-[20px]">search</span>
      </button>

      <button
        id="cart-icon-btn"
        aria-label={`Cart (${totalQuantity} items)`}
        onClick={openCart}
        className="hover:text-on-background transition-all duration-200 relative flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-[20px] transition-colors">shopping_bag</span>
        {totalQuantity > 0 && (
          <span className={`absolute -right-2.5 -top-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white transition-transform duration-300 ${isBouncing ? 'scale-125' : 'scale-100'}`}>
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

      {/* Mobile Navigation Drawer Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-surface h-full shadow-2xl flex flex-col p-8 animate-fade-in z-10">
            <div className="flex justify-between items-center mb-16">
              <span className="text-xl font-normal tracking-tight text-on-background font-serif">nailestial</span>
              <button
                aria-label={UI_TEXT.close}
                onClick={() => setMenuOpen(false)}
                className="p-2 text-on-surface-variant hover:text-on-background"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-8 text-left">
              <Link
                href="/en/collections"
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl text-on-background hover:text-on-surface-variant transition-colors"
              >
                {UI_TEXT.collections}
              </Link>
              <Link
                href="/en/collections/new-arrivals"
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl text-on-background hover:text-on-surface-variant transition-colors"
              >
                {UI_TEXT.newArrivals}
              </Link>
              <Link
                href="/en/about"
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl text-on-background hover:text-on-surface-variant transition-colors"
              >
                {UI_TEXT.ourStory}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
