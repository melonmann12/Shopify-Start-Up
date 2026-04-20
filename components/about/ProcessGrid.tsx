import Image from 'next/image'

export default function ProcessGrid() {
  return (
    <section className="py-32 px-8 md:px-16 bg-surface-container-low mt-16">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-24">
          <h3 className="font-headline text-3xl font-bold tracking-tight text-primary">THE PROCESS</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Design */}
          <div className="flex flex-col">
            <div className="aspect-[3/4] mb-6 overflow-hidden relative bg-surface-variant">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq76qCIuQZFGCYVbxCR0dSrSGx07Kd7jFP-HRIPn_4lbSdWv0UXu_FweQHdHX6GIh2TKxvTOfQR6i_QQZ4yiddRLNIezG0yx-m3EZMzFCeqCl05POul1TxmzMT-RNWNX_fddgw7Pvm-3MzBsS1GbqqEza99qImYWsAFBItd4XOuFQZvhTRYuD6sl-FmyZmS_eKQA38cRuhdbtrvz-yrmjwPv7jBY78f9Sj7ZrIbDmPKeYRETgfvwvZ3W1HD13RHaM_44TRw2D3DRpZ"
                alt="Architectural sketches and design process, minimal"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
            <div className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant font-semibold">01. Design</div>
          </div>
          {/* Material */}
          <div className="flex flex-col md:mt-24">
            <div className="aspect-square mb-6 overflow-hidden relative bg-surface-variant">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxvpV6E8wh7OIOFCNk8fFrveiAGBw6lh8H1704jRaWZvs8JT-wQo-LBYCfO-1XjC3092o0_Gs7eiq4TV3M3FobNzzIUupoLmy51WxJo3ViumDmc4C8VqrVVfQopOGFuPBk02n9h9vK4bWoVqD1bbfTYSgVG_bINsfk9oYuB8uXwJiBgWkh3JQRYjPkN-7HuTDJGgEobIH096gMGZwR61X5OCyFjAonOoIWIiaTjp9O8BzPdrv72Z46h6xlTb1xGtdapBB2zowZ3YUi"
                alt="Close up of premium fabric texture, dark gray"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
            <div className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant font-semibold">02. Material</div>
          </div>
          {/* Craft */}
          <div className="flex flex-col md:mt-12">
            <div className="aspect-[4/5] mb-6 overflow-hidden relative bg-surface-variant">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJdp5fvXWqF8RaC0ba8Q9uaoI7GNV1LNBFRtp41UfdDV_znvX8EQXZaqsbMFU52jq7Y3QdJyBwtzpH5w3wJyN7WYz6Ox4iFS8xgVjNJUqc0wdZJQHFB78SxE-XNPNuwpKCZjqapgcJ6m6sDns2pGbZAZHDejsE0ytGF1uRTcbmrGWSfRDNX9aiN3w6PbItZjx1XKPjl106GRbfF9uiwfdxLHIQYMa27nJOEfHy7tEEDZnVFSwFgumQm22zis6HEs1gauERXRoeMFez"
                alt="Artisan hands working on fabric, monochromatic"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
            <div className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant font-semibold">03. Craft</div>
          </div>
        </div>
      </div>
    </section>
  )
}
