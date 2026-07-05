import Image from 'next/image'

export default function VisionSection() {
  return (
    <section className="py-24 px-8 md:px-16 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        <div className="md:col-span-5 relative h-[819px] w-full bg-surface-variant">
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk4JWY0aM-MxOMZWGP8gaH8BIFhS0_pc4AYyRQJZbD5dPTAOMSou7Obi7N7WVaOB3qJmghVZdQXR8Eq_O49JJTcKKUxQq6W21-TrIV8vO26O8p99IM9y_N8U9d6Q0hiSwz6xeoyw9JACbwQMCgEMIPZIJxl_51LTRtcOfhbmq7hDWc_xbZM8_LDDu-NBrSwnx8c5282jjZXXsEza-4flDuiiT6SVfAhivX4jENBwRyIc5AZadDj8lwcWETCswftI8-fHIGPI4PviFh"
            alt="Editorial fashion portrait, black and white, dramatic lighting, high contrast"
            fill
            priority
            className="object-cover rounded-none"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        </div>
        <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center pr-0 md:pr-16">
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
            Simplicity is the ultimate sophistication.
          </h2>
          <div className="space-y-6 font-body text-base text-on-surface-variant leading-[1.8]">
            <p>
              Our philosophy is rooted in reduction. We strip away the unnecessary, leaving only the essential. This isn't minimalism for the sake of aesthetics; it's a commitment to clarity and purpose.
            </p>
            <p>
              Every garment is a study in proportion and material, designed to act as a quiet anchor in a noisy world. We source the finest textiles, not for prestige, but for their intrinsic character and longevity.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
