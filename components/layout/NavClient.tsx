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
    <div className="flex items-center gap-4 text-zinc-600">
      <button aria-label="search" className="hover:bg-zinc-100/50 transition-all duration-200 p-2 rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined">search</span>
      </button>

      <button
        id="cart-icon-btn"
        aria-label={`Cart (${totalQuantity} items)`}
        onClick={openCart}
        className="hover:bg-zinc-100/50 transition-all duration-200 p-2 rounded-full relative flex items-center justify-center"
      >
        <span className="material-symbols-outlined transition-colors">shopping_bag</span>
        {totalQuantity > 0 && (
          <span className={`absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white transition-transform duration-300 ${isBouncing ? 'scale-125' : 'scale-100'}`}>
            {totalQuantity}
          </span>
        )}
      </button>

      <button
        aria-label="Menu"
        onClick={() => setMenuOpen((v) => !v)}
        className="lg:hidden p-2"
      >
        <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
      </button>
    </div>
  )
}
