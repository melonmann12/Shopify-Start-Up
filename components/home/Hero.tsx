import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative w-full h-[870px] min-h-[600px] flex items-end pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto mb-32">
      <div className="absolute inset-0 bg-surface-container-highest z-0 overflow-hidden">
        <Image 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7wU03_G0qd522jUtrj6hHGF35ESNZ9I0SgDh8F1XYg3IX0BtZTnHBpdf3JBXGTLqnAOubrNXijg8rkDNeJI6YmEXKVy_42U1khM96TWZnKReaR-rxLmPFxagiBTF3ILACSqQSZT6ktcdd2lu3h7ZJz-CaJVz4r4uyf0z-prMB3K7pwToMAFECvADctk9qqf00RoVOhjzH9p7XcCv0mERz0B3Coic7n4TVysESixzp9OWRRdQevrxAqsvyHDrk5DCGGHxMFuH8hT4e"
          alt="Editorial fashion photography featuring a minimalist outfit"
          fill
          unoptimized
          className="object-cover object-top opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
      </div>
      <div className="relative z-10 w-full max-w-3xl text-on-primary">
        <h1 className="font-headline font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none mb-6">
          REDEFINING<br/>MODERN<br/>ESSENTIALS.
        </h1>
        <p className="font-body text-lg md:text-xl font-medium tracking-wide mb-10 max-w-lg opacity-90">
          Curated collections for the discerning individual. Designed for longevity.
        </p>
        <button className="inline-flex items-center justify-center bg-surface text-primary font-headline font-bold uppercase tracking-widest text-sm px-10 py-5 rounded-full hover:bg-surface-variant transition-colors duration-300">
          EXPLORE ALL
        </button>
      </div>
    </section>
  )
}
