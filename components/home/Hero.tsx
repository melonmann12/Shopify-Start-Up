import Image from 'next/image'
import Link from 'next/link'

interface Props {
  locale: string
}

export default function Hero({ locale }: Props) {
  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[90vh] border-b border-outline-variant/20">
      {/* Grid Layer: Mosaic Background Grid */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 pointer-events-none z-0">
        <div className="aspect-square border-r border-b border-primary-container/10"></div>
        <div className="aspect-square border-r border-b border-primary-container/10 relative overflow-hidden">
          <Image
            src="https://lh3.googleusercontent.com/aida/AP1WRLsRs5aO6Hn0FhR18_zr9Gg__FhEivz9b5SD86uuHbb3iueNN4wTKG2fBggL6TTtYZY23IDMg1_bpKzChblm_zkw-pMkbtWjg1vZ-0x7kCzQiZ0hC_0tZwED-yVYmxO0Z4ttzB8FJqeQS6dWQ9xxWVBExmgOHlPvZv9gyKAzoLalpVVO2TiQjB7Iv8_4FouzUA-DhJU_p8RK82_m4DUJdqZXX8-VIhd_cHT4YAFSGXmVwQKHzxQ01vW99w"
            alt="Taupe and gold luxury press-on nails detail"
            fill
            priority
            className="w-full h-full object-cover saturate-50 contrast-[1.1] opacity-90 mix-blend-multiply"
            sizes="(max-width: 768px) 25vw, 16.666vw"
          />
        </div>
        <div className="aspect-square border-r border-b border-primary-container/10"></div>
        <div className="aspect-square border-r border-b border-primary-container/10"></div>
        <div className="aspect-square border-r border-b border-primary-container/10"></div>
        <div className="aspect-square border-r border-b border-primary-container/10 relative overflow-hidden hidden md:block">
          <Image
            src="https://lh3.googleusercontent.com/aida/AP1WRLvAEidZl7491uEjHfz4rTDeq6KloNxCjai8gI0AUueCDFEe4q0Gbppes5Wc-5KyL6Dys9G9MaZn_nWzth5vjkz2oDhBgQx0d_F68da52LI7XddoT4jyAfCG6s_G0BLEkrD1ZxbORQGU4JBWekSEFIPB9mfZIvNqjwPYvgjpQ7705CP0rI_aL8rsI-SW49e694Kjodd60NY6sxjoAIoX-zNbN1pj3ibdttVp_73t0JOJfoFC8fnEWoJD"
            alt="Gold and blue-grey press-on nails detail"
            fill
            className="w-full h-full object-cover saturate-50 contrast-[1.1] opacity-90 mix-blend-multiply"
            sizes="16.666vw"
          />
        </div>
        <div className="aspect-square border-r border-b border-primary-container/10 relative overflow-hidden">
          <Image
            src="https://lh3.googleusercontent.com/aida/AP1WRLuNfZsE4Sftcnc3zGOVY9bWnXwyY6s3O6OdDe5mTlNKGs8b7N5RcvXfj4ljMsf_EupITFtLUKLDMMH-h9UfIVrDKfSEP_LWLk5PFY5MXRhs6sqhrE3s0hXgFMSZueATnW4_EpvyIY80y4dIaehvLyQfaZM1VQKt0KXkUniDUhKR3RJAkSOpNuiDRmfhiIZ5bD2Ipbf3LOk94H7wHYLkEntp4cTfm1TGWtqGJ3Is7piVqp0W1_H9qX2lPA"
            alt="Premium press-on nails arranged on marble"
            fill
            className="w-full h-full object-cover saturate-50 contrast-[1.1] opacity-90 mix-blend-multiply"
            sizes="(max-width: 768px) 25vw, 16.666vw"
          />
        </div>
        <div className="aspect-square border-r border-b border-primary-container/10"></div>
        <div className="aspect-square border-r border-b border-primary-container/10"></div>
        <div className="aspect-square border-r border-b border-primary-container/10"></div>
        <div className="aspect-square border-r border-b border-primary-container/10"></div>
        <div className="aspect-square border-r border-b border-primary-container/10 relative overflow-hidden hidden md:block">
          <Image
            src="https://lh3.googleusercontent.com/aida/AP1WRLtT4LmrPfXhBRz4TK9PXWWBqpOr5d02JqYchoasg6Oy0FJ7TB5Iv-8ySV_tnrXoRfrDNLc2dipDaMUGdc8AP3OI_R7bliJcFUgXogo0P2m46yhke7dETwSOfHe88nNhqNuMZe3ZbQyu_2ohm8uTzYF-sa52NfwX94SWeBW6v4wyQCGX2_KG0UbJmP0HL0eW46M-G36Miud-iIzxL392Rb1S7MaAjB0IPpAeCpFx9eQmq994bCJ6LyNonw"
            alt="Artistic press-on nails resting on silk fabric"
            fill
            className="w-full h-full object-cover saturate-50 contrast-[1.1] opacity-90 mix-blend-multiply"
            sizes="16.666vw"
          />
        </div>
        <div className="aspect-square border-r border-primary-container/10"></div>
        <div className="aspect-square border-primary-container/10"></div>
        <div className="aspect-square border-primary-container/10"></div>
        <div className="aspect-square border-primary-container/10"></div>
        <div className="aspect-square border-primary-container/10"></div>
        <div className="aspect-square border-l border-primary-container/10 hidden md:block"></div>
      </div>

      {/* Floating Text Layer */}
      <div className="relative z-10 text-center px-4 md:px-0 py-24 flex flex-col items-center pointer-events-auto">
        <h1 className="font-serif text-[46px] md:text-[80px] text-primary max-w-4xl mx-auto leading-tight mb-8 font-normal tracking-tight">
          Handcrafted<br />
          Luxury Press-On<br />
          <span className="italic">Nails</span>
        </h1>
        <Link
          href={`/${locale}/collections`}
          className="inline-block border border-primary px-8 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white transition-colors duration-200"
        >
          VIEW ITEMS
        </Link>
      </div>
    </section>
  )
}
