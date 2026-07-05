'use client'

import { useState } from 'react'

export default function InlineEmailCapture() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    console.log('[Inline Email Capture Success]:', email)
    // TODO: Wire up integration for marketing automation services here (e.g. Klaviyo, Mailchimp, Resend)
    // Example:
    // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })

    setIsSubmitted(true)
  }

  return (
    <section id="newsletter" className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-24 md:mb-32 relative z-10">
      <div className="border border-outline-variant/20 bg-surface-container-lowest/5 backdrop-blur-sm py-16 px-6 md:px-12 flex flex-col items-center text-center">
        
        {!isSubmitted ? (
          <div className="w-full max-w-xl flex flex-col items-center">
            <span className="text-on-surface-variant mb-4 block text-label">
              Join the Movement
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-on-background tracking-normal mb-4">
              Join the Inner Circle
            </h2>
            <p className="text-xs text-on-surface-variant max-w-md leading-relaxed mb-8 text-caption">
              Subscribe to receive early access to limited edition press-on drops, private collection invites, and editorial care tutorials.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-4 w-full max-w-lg">
              <div className="flex-grow">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full border-b border-outline-variant/60 bg-transparent px-0 py-3.5 font-body text-sm text-primary placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors text-left"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-8 py-3.5 hover:bg-black/85 transition-colors duration-300 rounded-none whitespace-nowrap text-label"
              >
                Subscribe
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 select-none">
              check_circle
            </span>
            <h3 className="font-serif text-2xl font-normal text-on-background mb-2">
              Welcome to the Circle
            </h3>
            <p className="text-xs text-on-surface-variant text-caption">
              You are now subscribed. Updates will be delivered to <span className="underline">{email}</span>.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
