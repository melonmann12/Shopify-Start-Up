'use client'
// components/layout/NavClient.tsx
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'

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
        className="lg:hidden p-2 text-on-surface-variant hover:text-on-background"
      >
        <span className="material-symbols-outlined text-[20px]">{menuOpen ? 'close' : 'menu'}</span>
      </button>
    </div>
  )
}
