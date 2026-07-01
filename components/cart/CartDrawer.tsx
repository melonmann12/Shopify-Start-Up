'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'

const UI_TEXT = {
  title: "Your Bag",
  empty: "Your bag is currently empty.",
  subtotal: "Subtotal",
  shippingNote: "Tax and shipping calculated at checkout.",
  checkout: "Checkout",
  updating: "Updating...",
  redirecting: "Redirecting...",
  remove: "Remove",
}

// ─── Cart Line Sub-component with local input state ───────────────────────────
function CartLineItem({
  line,
  updateLineQuantity,
  removeLine,
}: {
  line: any
  updateLineQuantity: (lineId: string, quantity: number) => Promise<void>
  removeLine: (lineId: string) => Promise<void>
}) {
  const merchandise = line.merchandise as any
  const image = merchandise.product?.images?.nodes[0]?.url
  const [inputValue, setInputValue] = useState(String(line.quantity))

  function commitQuantity(raw: string) {
    const parsed = parseInt(raw, 10)
    if (isNaN(parsed) || parsed < 1) {
      setInputValue(String(line.quantity))
      return
    }
    if (parsed !== line.quantity) {
      updateLineQuantity(line.id, parsed)
    }
  }

  // Sync with server value if field isn't focused
  if (
    String(line.quantity) !== inputValue &&
    typeof document !== 'undefined' &&
    document.activeElement?.id !== `qty-${line.id}`
  ) {
    setInputValue(String(line.quantity))
  }

  return (
    <li className="flex gap-4 border-b border-black/10 pb-6">
      <div className="relative h-24 w-20 flex-shrink-0 bg-[#f5f5f5] rounded-md overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={merchandise.product?.title || 'Product Image'}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between gap-2">
            <h3 className="font-semibold text-sm leading-snug">{merchandise.product?.title}</h3>
            <p className="font-medium text-sm whitespace-nowrap">
              {merchandise.price?.amount} {merchandise.price?.currencyCode}
            </p>
          </div>
          <p className="text-xs text-[#707070] mt-1">
            {merchandise.title !== 'Default Title' ? merchandise.title : ''}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-black/20 rounded-md overflow-hidden">
            {/* Decrement */}
            <button
              className="px-3 py-1 text-lg leading-none hover:bg-[#f5f5f5] disabled:text-black/30 transition-colors"
              onClick={() => {
                const next = line.quantity - 1
                if (next < 1) return
                setInputValue(String(next))
                updateLineQuantity(line.id, next)
              }}
              disabled={line.quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>

            {/* Custom quantity input — no spinners, no outline */}
            <input
              id={`qty-${line.id}`}
              type="number"
              min={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={(e) => commitQuantity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur()
              }}
              className="w-10 text-center text-sm bg-transparent outline-none focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            />

            {/* Increment */}
            <button
              className="px-3 py-1 text-lg leading-none hover:bg-[#f5f5f5] transition-colors"
              onClick={() => {
                const next = line.quantity + 1
                setInputValue(String(next))
                updateLineQuantity(line.id, next)
              }}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            className="text-xs text-[#707070] hover:text-black underline underline-offset-2 transition-colors"
            onClick={() => removeLine(line.id)}
          >
            {UI_TEXT.remove}
          </button>
        </div>
      </div>
    </li>
  )
}

// ─── Main CartDrawer ───────────────────────────────────────────────────────────
export default function CartDrawer() {
  const { cart, isOpen, isPending, closeCart, removeLine, updateLineQuantity } = useCart()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleCheckout = () => {
    // Read checkoutUrl from the Zustand store at click time — never from a
    // closure or cached ref. getState() always returns the latest snapshot,
    // regardless of React render cycles or useEffect scheduling.
    const latestCart = useCartStore.getState().cart
    const url = latestCart?.checkoutUrl ?? cart?.checkoutUrl
    if (!url || isPending || isRedirecting) return

    setIsRedirecting(true)

    // Safety reset: if navigation hasn't started within 5s, unlock the button
    // so the user can retry rather than being permanently stuck.
    const safetyTimer = setTimeout(() => setIsRedirecting(false), 5000)

    try {
      window.location.href = url
    } catch {
      clearTimeout(safetyTimer)
      setIsRedirecting(false)
    }
  }


  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[101] w-full sm:max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <h2 className="text-xl font-bold tracking-tight">
            {UI_TEXT.title}
            {(cart?.totalQuantity ?? 0) > 0 && (
              <span className="ml-2 text-sm font-normal text-[#707070]">
                ({cart!.totalQuantity} {cart!.totalQuantity === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Line items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart || cart.lines.nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#707070] gap-4">
              <span className="material-symbols-outlined text-5xl">shopping_bag</span>
              <p className="text-sm">{UI_TEXT.empty}</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.lines.nodes.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  updateLineQuantity={updateLineQuantity}
                  removeLine={removeLine}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer / Checkout */}
        {cart && cart.lines.nodes.length > 0 && (
          <div className="px-6 py-6 border-t border-black/10">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-[#707070]">{UI_TEXT.subtotal}</span>
              <span className="font-semibold">
                {parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}{' '}
                {cart.cost.subtotalAmount.currencyCode}
              </span>
            </div>
            <p className="text-xs text-[#707070] mb-5">{UI_TEXT.shippingNote}</p>

            <button
              onClick={handleCheckout}
              disabled={isRedirecting || isPending || !cart.checkoutUrl}
              className={`flex w-full items-center justify-center gap-2 py-4 rounded-full font-bold text-base tracking-wide transition-all duration-200 ${
                isRedirecting
                  ? 'bg-black/60 text-white/80 cursor-wait'
                  : isPending
                    ? 'bg-black/40 text-white/60 cursor-wait'
                    : 'bg-black text-white hover:bg-[#333] active:scale-[0.98]'
              }`}
            >
              {(isRedirecting || isPending) && (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isRedirecting ? UI_TEXT.redirecting : isPending ? UI_TEXT.updating : UI_TEXT.checkout}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
