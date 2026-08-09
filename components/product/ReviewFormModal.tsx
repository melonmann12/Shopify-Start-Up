'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'

interface ReviewFormModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productTitle: string
}

export default function ReviewFormModal({ isOpen, onClose, productId, productTitle }: ReviewFormModalProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [files, setFiles] = useState<File[]>([])
  
  const [status, setStatus] = useState<'idle' | 'uploading' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const modalRef = useRef<HTMLDivElement>(null)

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL((file as any).previewUrl))
    }
  }, [files])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    
    if (files.length + selected.length > 5) {
      setErrorMessage('You can upload a maximum of 5 images.')
      return
    }

    const validFiles = selected.filter(f => {
      if (f.size > 10 * 1024 * 1024) {
        setErrorMessage('One or more files exceed the 10MB limit.')
        return false
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        setErrorMessage('Only JPG, PNG, and WEBP formats are allowed.')
        return false
      }
      return true
    })

    // Attach temporary preview URLs
    validFiles.forEach(file => {
      (file as any).previewUrl = URL.createObjectURL(file)
    })

    setFiles(prev => [...prev, ...validFiles])
    
    // Clear the input so selecting the same file again triggers onChange
    if (e.target) e.target.value = ''
  }

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL((newFiles[indexToRemove] as any).previewUrl)
      newFiles.splice(indexToRemove, 1)
      return newFiles
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setErrorMessage('Please select a rating.')
      return
    }

    setErrorMessage('')
    let pictureUrls: string[] = []

    try {
      // 1. Upload Images if present
      if (files.length > 0) {
        setStatus('uploading')
        const formData = new FormData()
        files.forEach(f => formData.append('images', f))

        const uploadRes = await fetch('/api/reviews/upload', {
          method: 'POST',
          body: formData
        })

        const uploadData = await uploadRes.json().catch(() => null)
        if (!uploadRes.ok) {
          throw new Error(uploadData?.error || 'Failed to upload images. Please try again.')
        }
        pictureUrls = uploadData.urls || []
      }

      // 2. Submit Review
      setStatus('loading')
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          name,
          email,
          title,
          body,
          pictureUrls
        })
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Submission failed. Please try again later.')
      }

      setStatus('success')
      router.refresh()
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err.message || 'An error occurred.')
    }
  }

  const renderContent = () => {
    if (status === 'success') {
      return (
        <div className="text-center py-10 px-4">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[32px]">check</span>
          </div>
          <h3 className="font-serif text-2xl text-on-background mb-4">Thank you for your review.</h3>
          <p className="text-on-surface-variant font-sans text-sm mb-8">
            Thank you! Your review was submitted successfully and may take a few minutes to appear.
          </p>
          <button
            onClick={() => {
              setFiles([])
              onClose()
            }}
            className="px-8 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/85 transition-colors rounded-sm"
          >
            Close
          </button>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 md:p-8">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-on-background mb-1">Write a Review</h2>
          <p className="font-sans text-sm text-on-surface-variant">for {productTitle}</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-800 text-sm rounded border border-red-200">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm font-medium text-on-background">Rating <span className="text-red-500">*</span></label>
          <div 
            className="flex gap-1 text-on-background cursor-pointer"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="material-symbols-outlined text-[28px] transition-colors"
                style={{ fontVariationSettings: `'FILL' ${(hoverRating || rating) >= star ? 1 : 0}` }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
              >
                star
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="review-name" className="font-sans text-sm font-medium text-on-background">Name <span className="text-red-500">*</span></label>
            <input 
              id="review-name"
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-outline-variant/50 rounded-sm focus:outline-none focus:border-on-background bg-surface-container-lowest font-sans text-sm"
              placeholder="Your name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="review-email" className="font-sans text-sm font-medium text-on-background">Email <span className="text-red-500">*</span></label>
            <input 
              id="review-email"
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-outline-variant/50 rounded-sm focus:outline-none focus:border-on-background bg-surface-container-lowest font-sans text-sm"
              placeholder="Your email"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-title" className="font-sans text-sm font-medium text-on-background">Review Title</label>
          <input 
            id="review-title"
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-outline-variant/50 rounded-sm focus:outline-none focus:border-on-background bg-surface-container-lowest font-sans text-sm"
            placeholder="Sum up your experience (optional)"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-body" className="font-sans text-sm font-medium text-on-background">Review <span className="text-red-500">*</span></label>
          <textarea 
            id="review-body"
            required 
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 border border-outline-variant/50 rounded-sm focus:outline-none focus:border-on-background bg-surface-container-lowest font-sans text-sm resize-y"
            placeholder="Share your thoughts about this product"
          />
        </div>

        {/* Media Upload Section */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm font-medium text-on-background">Add photos (optional)</label>
          
          <div className="flex flex-wrap gap-3 mt-1">
            {files.map((file, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-sm overflow-hidden border border-outline-variant/30 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={(file as any).previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black"
                  title="Remove image"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}

            {files.length < 5 && (
              <div className="relative w-16 h-16 rounded-sm border-2 border-dashed border-outline-variant/40 flex items-center justify-center hover:border-on-background/50 transition-colors bg-surface-container-lowest cursor-pointer">
                <input 
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Add photos"
                />
                <span className="material-symbols-outlined text-on-surface-variant/70 text-[20px]">add_photo_alternate</span>
              </div>
            )}
          </div>
          {files.length > 0 && (
            <p className="text-[11px] text-on-surface-variant/70 mt-1">{files.length} of 5 images selected</p>
          )}
        </div>

        <div className="mt-2">
          <button 
            type="submit" 
            disabled={status === 'loading' || status === 'uploading'}
            className="w-full py-3.5 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-black/85 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'uploading' ? 'Uploading...' : status === 'loading' ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    )
  }

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-lg bg-surface relative rounded-sm shadow-xl flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-background transition-colors z-10"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        
        {renderContent()}
      </div>
    </div>,
    document.body
  )
}
