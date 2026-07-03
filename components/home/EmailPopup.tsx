'use client'

import { useState, useEffect } from 'react'

export default function EmailPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDismissed, setIsDismissed] = useState(true) // Initialized to true to guard against Next.js SSR hydration mismatches

  useEffect(() => {
    // 1. Guard against SSR: localStorage is only accessed on client-side mount
    const hasDismissed = localStorage.getItem('nailestial_newsletter_dismissed')
    if (hasDismissed) {
      setIsDismissed(true)
      return
    }
    
    // Set state to false to trigger the reactive timer and listener registration
    setIsDismissed(false)
  }, [])

  useEffect(() => {
    if (isDismissed) return

    // 2. Trigger modal after a 5-second delay
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 5000)

    // 3. Exit-intent trigger
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 50) { // User moving cursor towards tab bar
        setIsOpen(true)
        clearTimeout(timer)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isDismissed])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('nailestial_newsletter_dismissed', 'true')
    setIsDismissed(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    console.log('[Email Capture Success]:', email)
    // TODO: Wire up integration for marketing automation services here (e.g., Klaviyo, Mailchimp, Resend)
    // Example:
    // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })

    setIsSubmitted(true)
    localStorage.setItem('nailestial_newsletter_dismissed', 'true')
    setIsDismissed(true)
    
    // Auto close after 2 seconds on success
    setTimeout(() => {
      setIsOpen(false)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#f9f9f7] border border-outline-variant/30 p-8 md:p-12 shadow-2xl flex flex-col z-10 animate-fade-in rounded-none">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-on-surface-variant hover:text-on-background transition-colors"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col text-left">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-on-surface-variant mb-4 block">
              Mailing List
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-normal text-on-background leading-tight mb-4">
              Get 15% Off<br />Your First Order
            </h3>
            <p className="font-serif italic text-sm text-on-surface-variant leading-relaxed mb-8">
              Join the Nailestial inner circle. Receive early access to limited edition press-on drops, nail care guides, and exclusive collection invites.
            </p>

            <div className="flex flex-col gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full border-b border-outline-variant/60 bg-transparent px-0 py-3 font-body text-sm text-primary placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-black text-white font-mono text-[10px] uppercase tracking-[0.2em] py-4 hover:bg-black/80 transition-colors duration-300 rounded-none mt-2"
              >
                Subscribe
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">check_circle</span>
            <h3 className="font-serif text-2xl font-normal text-on-background mb-2">Thank You</h3>
            <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Your 15% code is on its way.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
