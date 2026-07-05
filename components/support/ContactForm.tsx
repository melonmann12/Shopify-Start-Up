'use client'

import { useActionState } from 'react'
import { submitContactForm } from '@/lib/actions/contact'

const initialState = {
  success: false,
  error: '',
  message: ''
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState)

  return (
    <section className="py-24 md:py-32 px-8 bg-surface-container-low">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl font-bold text-primary mb-4">Still need assistance?</h2>
          <p className="font-body text-on-surface-variant">Send us a message and our concierge team will assist you.</p>
        </div>
        
        {state?.success ? (
          <div className="text-center bg-surface-container py-12 px-8 rounded-2xl transform transition-all duration-500 scale-100">
             <span className="material-symbols-outlined text-4xl text-primary mb-4 block animate-bounce">check_circle</span>
             <h3 className="font-headline text-2xl font-bold text-primary mb-2">Message Received</h3>
             <p className="font-body text-on-surface-variant max-w-sm mx-auto">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-12">
            {state?.error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm mb-8 text-caption">
                {state.error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Name Input */}
              <div className="relative">
                <label className="block text-xs text-on-surface-variant mb-2 text-label" htmlFor="name">Name</label>
                <input 
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-3 font-body text-base text-primary focus:ring-0 focus:border-primary transition-colors disabled:opacity-50 outline-none" 
                  id="name" 
                  name="name" 
                  placeholder=" " 
                  type="text"
                  required
                  disabled={pending}
                />
              </div>
              {/* Email Input */}
              <div className="relative">
                <label className="block text-xs text-on-surface-variant mb-2 text-label" htmlFor="email">Email</label>
                <input 
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-3 font-body text-base text-primary focus:ring-0 focus:border-primary transition-colors disabled:opacity-50 outline-none" 
                  id="email" 
                  name="email" 
                  placeholder=" " 
                  type="email"
                  required
                  disabled={pending}
                />
              </div>
            </div>
            {/* Message Input */}
            <div className="relative">
              <label className="block text-xs text-on-surface-variant mb-2 text-label" htmlFor="message">Message</label>
              <textarea 
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-3 font-body text-base text-primary focus:ring-0 focus:border-primary transition-colors resize-none disabled:opacity-50 outline-none" 
                id="message" 
                name="message" 
                placeholder=" " 
                rows={4}
                required
                disabled={pending}
              ></textarea>
            </div>
            {/* Submit Button */}
            <div className="pt-8">
              <button 
                className="w-full md:w-auto bg-primary text-on-primary text-sm px-12 py-5 rounded-full hover:bg-primary-fixed transition-colors duration-300 disabled:opacity-70 flex items-center justify-center min-w-[220px] text-label" 
                type="submit"
                disabled={pending}
              >
                {pending ? (
                  <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'wght' 300" }}>sync</span>
                ) : 'SEND MESSAGE'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
