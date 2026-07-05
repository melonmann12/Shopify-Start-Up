'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import React from 'react'

interface HomeLinkProps {
  href: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  children: React.ReactNode
}

export default function HomeLink({ href, className, onClick, children }: HomeLinkProps) {
  const pathname = usePathname()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const targetHomePath = `/${locale}`

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If the user is already on the homepage (e.g. /en or /vi), scroll smoothly to the top
    if (pathname === targetHomePath || pathname === '/') {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    
    // Execute custom onClick if provided (e.g., closing mobile drawers)
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
