// components/home/AsSeenIn.tsx

export default function AsSeenIn() {
  const placeholders = [
    'Publication 1',
    'Publication 2',
    'Publication 3',
    'Publication 4',
    'Publication 5'
  ]

  return (
    <section className="w-full border-y border-outline/10 bg-surface-container-lowest/30 py-16 md:py-24 my-24 md:my-32 relative z-10">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex flex-col items-center">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-on-background tracking-widest uppercase mb-12 md:mb-16">
          As Seen In
        </h2>
        
        {/* Logo Strip */}
        <div className="w-full relative">
          {/* Fading edges for smooth overflow on mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden" />
          
          <div className="flex items-center justify-start md:justify-center gap-12 md:gap-24 overflow-x-auto no-scrollbar pb-4 md:pb-0 px-4">
            {placeholders.map((name, i) => (
              <div 
                key={i} 
                className="shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
              >
                {/* 
                  TODO: Replace these text spans with actual monochrome logo SVGs 
                  once real press mentions are secured.
                */}
                <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-on-background uppercase select-none">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
