import HomeLink from './HomeLink'
import Image from 'next/image'
import NavClient from './NavClient'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_COLLECTIONS } from '@/lib/shopify/queries/collection'

interface CollectionsResponse {
  collections: {
    nodes: {
      id: string
      title: string
      handle: string
    }[]
  }
}

interface Props {
  locale?: string
}

export default async function Navbar({ locale = 'en' }: Props) {
  let collections: { id: string; title: string; handle: string }[] = []

  try {
    const country = locale === 'vi' ? 'VN' : 'US'
    const language = locale.toUpperCase() === 'VI' ? 'VI' : 'EN'

    const data = await shopifyFetch<CollectionsResponse>(GET_COLLECTIONS, {
      first: 100,
      country,
      language,
    })

    const raw = data?.collections?.nodes || []
    // Strip out Shopify internal defaults — NavClient also filters, this is a server-side safety net
    collections = raw.filter(
      (c) =>
        c.handle !== 'frontpage' &&
        c.title !== 'Home page' &&
        c.title !== 'Homepage'
    )
  } catch (error) {
    console.error('[Navbar collections fetch error]:', error)
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 border-b border-outline/20 md:backdrop-blur-md">
      <nav aria-label="Top Navigation" className="flex justify-between items-center w-full px-4 sm:px-8 py-3 sm:py-5 max-w-full mx-auto">
        <HomeLink href={`/${locale}`} className="flex items-center">
          <Image
            src="/logo.png"
            alt="Nailestial"
            width={160}
            height={40}
            className="h-8 sm:h-10 w-auto object-contain"
            priority
          />
        </HomeLink>

        <NavClient initialCollections={collections} />
      </nav>
    </header>
  )
}
