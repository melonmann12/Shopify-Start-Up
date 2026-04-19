// store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ShopifyCart } from '@/lib/shopify/types'

interface CartStore {
  cartId: string | null
  cart: ShopifyCart | null
  isOpen: boolean
  setCart: (cart: ShopifyCart) => void
  setCartId: (id: string) => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartId: null,
      cart: null,
      isOpen: false,
      setCart: (cart) => set({ cart }),
      setCartId: (cartId) => set({ cartId }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartId: state.cartId }), // Only persist cartId
    }
  )
)
