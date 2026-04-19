import Image from 'next/image'

export default function CategoryShowcase() {
  return (
    <section className="bg-surface-container-low py-32 mb-0">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12">
          {/* <!-- Large Feature (Apparel) --> */}
          <div className="md:col-span-8 group cursor-pointer relative overflow-hidden bg-surface aspect-square md:aspect-auto md:h-[800px]">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC68kutibISJ1-XN358aKBoAWhTSD9gNLRkySqNrF2qlPqOqwIrEZfB_k-2uqX8N7WD7l7bvzUX-xZmBryzT3TonraaAIw5dPtL1w_SB0qbIsY6jViewh5aGRlkEuvbctbTk8SXglT_PiLWKR9pUk8-6C6Dhl5L1re02ox2DGNkvFjTyNbfTvYwuMMzF3lG-ogZrqHHTL2TvNmszLxeVaU69xCB_OjlqN8vIlINfVw3LM-z51Fdu0tUGqHQtCtLwEEyVvybpJZ0v-Hz" 
              alt="Apparel Category" 
              fill
              unoptimized
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-in-out opacity-90" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-12">
              <h3 className="font-headline font-bold text-4xl text-on-primary mb-2">APPAREL</h3>
              <span className="font-label text-sm uppercase tracking-widest text-on-primary/80">Explore The Collection</span>
            </div>
          </div>
          
          {/* <!-- Secondary Features Stack --> */}
          <div className="md:col-span-4 flex flex-col gap-6 lg:gap-12 h-full">
            {/* <!-- Footwear --> */}
            <div className="group cursor-pointer relative overflow-hidden bg-surface flex-1 aspect-square md:aspect-auto">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO-ZMsgQlPI_pvBHJmwdw4ECtLNbpreMZTxWavpzh8r95dfCB1dl2FekFjKmk5YsZtA3bBkmt8sNMjd1prEuXN8jJB9K0AK1pYI3HX7W1i5SVbIDACoMorZD6B8roitcJiOrcNtI4Tzt1x3QXskCxseHC3aMGXTkypi0lXfxVJG9RziRkwk2PfQA5nxxL_B74a_N4oqZ35GI0tt9R6jwgIybZ22w_sTqAQ-ECBajbM_szq6e426C_ZsN-H52UFvdHu-SZMkdS6n4BP" 
                alt="Footwear Category" 
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-in-out opacity-90" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="font-headline font-bold text-2xl text-on-primary mb-1">FOOTWEAR</h3>
                <span className="font-label text-xs uppercase tracking-widest text-on-primary/80">Shop Shoes</span>
              </div>
            </div>
            
            {/* <!-- Objects --> */}
            <div className="group cursor-pointer relative overflow-hidden bg-surface flex-1 aspect-square md:aspect-auto">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbI3SSokFp0waYO2pWpvicQSyLBOVlF_GdD0MDdPcKyh-y10woNXgL4sMAZLP-koOty3bJLTgnv1VCYGiDHA-OaYY-CqViH454rRNTA8QUDdtBRVwDLlyGsdGdnWHNky1ROGwFuWinAoBtZA76iZId6UYgyTE-tapJjju21I3mys_fS7OlQWAj_JbaFKbB1AAozIqcYjk_aQrQo3ZFyaWNNQcFg4pw10TdP1g3heZC3dH8QmHANzocwfSTOUkWqVT1o1symj1IR8iz" 
                alt="Objects Category" 
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-in-out opacity-90" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="font-headline font-bold text-2xl text-on-primary mb-1">OBJECTS</h3>
                <span className="font-label text-xs uppercase tracking-widest text-on-primary/80">Shop Accessories</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
