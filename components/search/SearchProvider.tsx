'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import PredictiveSearchOverlay from '@/components/search/PredictiveSearchOverlay'

interface SearchContextType {
  isOpen: boolean
  initialQuery: string
  openSearch: (query?: string) => void
  closeSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children, locale }: { children: ReactNode; locale: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')

  const openSearch = useCallback((query: string = '') => {
    setInitialQuery(query)
    setIsOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <SearchContext.Provider value={{ isOpen, initialQuery, openSearch, closeSearch }}>
      {children}
      <PredictiveSearchOverlay 
        isOpen={isOpen} 
        onClose={closeSearch} 
        locale={locale} 
        initialQuery={initialQuery} 
      />
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
