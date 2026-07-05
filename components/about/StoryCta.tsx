import Image from 'next/image'
import Link from 'next/link'

interface Props {
  locale: string
}

export default function StoryCta({ locale }: Props) {
  return (
    <section className="py-32 px-8 md:px-16 max-w-screen-xl mx-auto text-center">
      <div className="aspect-[21/9] w-full mb-16 overflow-hidden bg-surface-variant relative">
        <Image 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbwKkRyFymtgBs--6xycfy-X9qTgbbBKiB6yjjjU0961z7SO6WWf4XHpui8OYxcmhUlDFo-BETkG9se3T8NWTucpracf0ym6kU6AJqv_pVYprNO5pWzcTcr2jm5tMnuUquIozauRV2eb_caHywWYrCBx4GtolTRIcjmOuJgdIv9MBtZpkHy0yJ5hFWou3QlpY2NwfIixN7SmCC69qnOT9sl9-nC8Hdkw4bOyT4k-xAZ7P79x8sEJXNde4EsHKGz5ZNXMjtq73u3yNd"
          alt="Minimalist clothing rack against concrete wall"
          fill
          priority
          className="object-cover opacity-90"
          sizes="(max-width: 1280px) 100vw, 1280px"
          unoptimized
        />
      </div>
      <Link 
        href={`/${locale}/collections`}
        className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-fixed transition-colors duration-300 text-label"
      >
        SHOP THE COLLECTION
      </Link>
    </section>
  )
}
