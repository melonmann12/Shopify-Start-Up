import Image from 'next/image'

export default function CategoryShowcase() {
  return (
    <section className="py-16 md:py-24 mb-0 relative z-10">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12">
          {/* <!-- Large Feature (Press-On Sets) --> */}
          <div className="md:col-span-8 glass-card border border-outline-variant/20 p-4 rounded-none group cursor-pointer relative block">
            <div className="w-full h-full relative overflow-hidden bg-surface-container-low border border-outline-variant/10 aspect-square md:aspect-auto md:h-[768px]">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC68kutibISJ1-XN358aKBoAWhTSD9gNLRkySqNrF2qlPqOqwIrEZfB_k-2uqX8N7WD7l7bvzUX-xZmBryzT3TonraaAIw5dPtL1w_SB0qbIsY6jViewh5aGRlkEuvbctbTk8SXglT_PiLWKR9pUk8-6C6Dhl5L1re02ox2DGNkvFjTyNbfTvYwuMMzF3lG-ogZrqHHTL2TvNmszLxeVaU69xCB_OjlqN8vIlINfVw3LM-z51Fdu0tUGqHQtCtLwEEyVvybpJZ0v-Hz" 
                alt="Press-On Sets Category" 
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out saturate-50 contrast-[1.1] opacity-90 mix-blend-multiply" 
              />
              <div className="absolute bottom-8 left-8 bg-surface-bright/90 px-6 py-4 border border-outline-variant/30 md:backdrop-blur-sm rounded-none shadow-sm">
                <h3 className="font-serif text-3xl font-normal text-on-background mb-1">PRESS-ON SETS</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Explore The Collection</span>
              </div>
            </div>
          </div>
          
          {/* <!-- Secondary Features Stack --> */}
          <div className="md:col-span-4 flex flex-col gap-6 lg:gap-12 h-full">
            {/* <!-- Nail Care --> */}
            <div className="glass-card border border-outline-variant/20 p-4 rounded-none group cursor-pointer relative block flex-1">
              <div className="w-full h-full relative overflow-hidden bg-surface-container-low border border-outline-variant/10 aspect-square md:aspect-auto md:h-[352px]">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO-ZMsgQlPI_pvBHJmwdw4ECtLNbpreMZTxWavpzh8r95dfCB1dl2FekFjKmk5YsZtA3bBkmt8sNMjd1prEuXN8jJB9K0AK1pYI3HX7W1i5SVbIDACoMorZD6B8roitcJiOrcNtI4Tzt1x3QXskCxseHC3aMGXTkypi0lXfxVJG9RziRkwk2PfQA5nxxL_B74a_N4oqZ35GI0tt9R6jwgIybZ22w_sTqAQ-ECBajbM_szq6e426C_ZsN-H52UFvdHu-SZMkdS6n4BP" 
                  alt="Nail Care Category" 
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out saturate-50 contrast-[1.1] opacity-90 mix-blend-multiply" 
                />
                <div className="absolute bottom-6 left-6 bg-surface-bright/90 px-6 py-4 border border-outline-variant/30 md:backdrop-blur-sm rounded-none shadow-sm">
                  <h3 className="font-serif text-xl font-normal text-on-background mb-1">NAIL CARE</h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Shop Essentials</span>
                </div>
              </div>
            </div>
            
            {/* <!-- Accessories --> */}
            <div className="glass-card border border-outline-variant/20 p-4 rounded-none group cursor-pointer relative block flex-1">
              <div className="w-full h-full relative overflow-hidden bg-surface-container-low border border-outline-variant/10 aspect-square md:aspect-auto md:h-[352px]">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbI3SSokFp0waYO2pWpvicQSyLBOVlF_GdD0MDdPcKyh-y10woNXgL4sMAZLP-koOty3bJLTgnv1VCYGiDHA-OaYY-CqViH454rRNTA8QUDdtBRVwDLlyGsdGdnWHNky1ROGwFuWinAoBtZA76iZId6UYgyTE-tapJjju21I3mys_fS7OlQWAj_JbaFKbB1AAozIqcYjk_aQrQo3ZFyaWNNQcFg4pw10TdP1g3heZC3dH8QmHANzocwfSTOUkWqVT1o1symj1IR8iz" 
                  alt="Accessories Category" 
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out saturate-50 contrast-[1.1] opacity-90 mix-blend-multiply" 
                />
                <div className="absolute bottom-6 left-6 bg-surface-bright/90 px-6 py-4 border border-outline-variant/30 md:backdrop-blur-sm rounded-none shadow-sm">
                  <h3 className="font-serif text-xl font-normal text-on-background mb-1">ACCESSORIES</h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Shop Tools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
