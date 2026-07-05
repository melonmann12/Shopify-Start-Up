import type { Metadata } from 'next'
import { type Locale } from '@/lib/i18n/config'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Crafted for the modern icon. We believe in the enduring power of considered design.',
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AboutPage(props: Props) {
  const params = await props.params
  const locale = params.locale as Locale

  return (
    <div className="w-full relative overflow-hidden">
      {/* Atmospheric Backgrounds */}
      <div className="grid-bg"></div>
      <div className="misty-bg"></div>

      <main className="pt-[140px] pb-24 relative z-10 max-w-[1920px] mx-auto">
        {/* Hero Section */}
        <section className="px-6 md:px-12 mb-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 md:col-start-3 text-center mb-12">
            <h1 className="font-serif text-[42px] md:text-[80px] text-on-background mb-6 font-normal leading-tight">
              The Art of Handcrafted Luxury
            </h1>
            <p className="text-xs text-on-surface-variant max-w-2xl mx-auto opacity-80 leading-relaxed text-label">
              Elevating the everyday through meticulous design and unparalleled craftsmanship.
            </p>
          </div>
          <div className="col-span-12 md:col-span-10 md:col-start-2 glass-card aspect-video relative overflow-hidden flex items-center justify-center p-4 border border-outline-variant/20">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrbzIFVekwp41g8Qvf1z35S4KEGlscTMbDrWgUBJgLjaxDfiPst4dLEsinM35rVCpAeFMzGlZ57ZVhKlmasAt0K7JNc2Cq-rKByNZdGBhG8iwGAPm8Gjt-bH4TpFDlypOwGFy5qqZMdCOexQPNUbmNDOpKJsgxmqAD3aSbFc7GRqvdSEiMTNymApt9COpo9h3wZ8izSkOG6WHkDTVdZJJjXu1w0r3B6lhPw1wu2-evtmUxMwxho1jd-6Fmk5snNOVz5xRi3yqUJA"
              alt="Hands working on delicate press-on nails"
              fill
              priority
              className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply"
              sizes="(max-width: 1024px) 100vw, 85vw"
            />
          </div>
        </section>

        {/* Mission / Story Bento */}
        <section className="px-6 md:px-12 mb-24 grid grid-cols-12 gap-6 items-stretch">
          <div className="col-span-12 md:col-span-5 glass-card p-8 md:p-12 flex flex-col justify-center border border-outline-variant/20">
            <h2 className="font-serif text-3xl md:text-4xl text-on-background font-normal mb-6">
              Our Philosophy
            </h2>
            <div className="w-8 h-[1px] bg-primary/20 mb-8"></div>
            <p className="text-xs text-on-surface-variant leading-[1.8] mb-6 text-caption">
              We believe that true beauty lies in the details. Nailé was born from a desire to bridge the gap between high-fashion editorial aesthetics and accessible daily luxury. Every set is conceived as a miniature canvas.
            </p>
            <p className="text-xs text-on-surface-variant leading-[1.8] text-caption">
              Our studio operates on the principles of slow beauty—taking the time to perfect every curve, every shade, and every finish. We reject mass production in favor of mindful creation.
            </p>
          </div>

          <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1 glass-card p-8 border border-outline-variant/20 flex flex-col justify-between aspect-square">
              <span className="text-on-surface-variant opacity-65 text-label">
                Est. 2024
              </span>
              <h3 className="font-serif text-2xl font-normal text-on-background mt-auto leading-tight">
                A Heritage of Detail
              </h3>
            </div>
            
            <div className="col-span-2 md:col-span-1 glass-card relative overflow-hidden aspect-square border border-outline-variant/20">
              <Image
                src="https://lh3.googleusercontent.com/aida/AP1WRLvAEidZl7491uEjHfz4rTDeq6KloNxCjai8gI0AUueCDFEe4q0Gbppes5Wc-5KyL6Dys9G9MaZn_nWzth5vjkz2oDhBgQx0d_F68da52LI7XddoT4jyAfCG6s_G0BLEkrD1ZxbORQGU4JBWekSEFIPB9mfZIvNqjwPYvgjpQ7705CP0rI_aL8rsI-SW49e694Kjodd60NY6sxjoAIoX-zNbN1pj3ibdttVp_73t0JOJfoFC8fnEWoJD"
                alt="Craftsmanship detail photography"
                fill
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>

            <div className="col-span-2 glass-card p-8 border border-outline-variant/20 flex flex-col justify-center">
              <p className="font-serif italic text-base md:text-lg text-on-surface-variant text-center leading-relaxed">
                &quot;A sanctuary for those who view self-care as an art form.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* Process Highlights */}
        <section className="px-6 md:px-12 mb-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 mb-12 text-center">
            <h2 className="text-on-surface-variant mb-4 text-label">
              The Process
            </h2>
            <div className="w-[1px] h-12 bg-primary/20 mx-auto"></div>
          </div>

          <div className="col-span-12 md:col-span-4 glass-card p-8 border border-outline-variant/20 flex flex-col justify-between group hover:bg-white/30 transition-colors duration-500 min-h-[320px]">
            <div>
              <span className="text-on-surface-variant mb-6 block opacity-50 text-label">
                01
              </span>
              <h3 className="font-serif text-2xl font-normal text-on-background mb-4">
                Design
              </h3>
              <p className="text-xs text-on-surface-variant leading-[1.8] text-caption">
                Conceptualizing ethereal patterns inspired by natural elements and architectural forms.
              </p>
            </div>
            <div className="h-[1px] w-0 bg-on-background group-hover:w-full transition-all duration-700 mt-6"></div>
          </div>

          <div className="col-span-12 md:col-span-4 glass-card p-8 border border-outline-variant/20 flex flex-col justify-between group hover:bg-white/30 transition-colors duration-500 min-h-[320px]">
            <div>
              <span className="text-on-surface-variant mb-6 block opacity-50 text-label">
                02
              </span>
              <h3 className="font-serif text-2xl font-normal text-on-background mb-4">
                Paint
              </h3>
              <p className="text-xs text-on-surface-variant leading-[1.8] text-caption">
                Hand-painted with meticulous precision, utilizing custom-blended pigments for unparalleled depth.
              </p>
            </div>
            <div className="h-[1px] w-0 bg-on-background group-hover:w-full transition-all duration-700 mt-6"></div>
          </div>

          <div className="col-span-12 md:col-span-4 glass-card border border-outline-variant/20 relative overflow-hidden min-h-[320px] flex flex-col justify-end">
            <Image
              src="https://lh3.googleusercontent.com/aida/AP1WRLuNfZsE4Sftcnc3zGOVY9bWnXwyY6s3O6OdDe5mTlNKGs8b7N5RcvXfj4ljMsf_EupITFtLUKLDMMH-h9UfIVrDKfSEP_LWLk5PFY5MXRhs6sqhrE3s0hXgFMSZueATnW4_EpvyIY80y4dIaehvLyQfaZM1VQKt0KXkUniDUhKR3RJAkSOpNuiDRmfhiIZ5bD2Ipbf3LOk94H7wHYLkEntp4cTfm1TGWtqGJ3Is7piVqp0W1_H9qX2lPA"
              alt="Quality check phase"
              fill
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 30vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-bright/90 via-surface-bright/40 to-transparent flex flex-col justify-end p-8 z-10 pointer-events-none">
              <span className="text-on-surface-variant mb-2 opacity-70 text-label">
                03
              </span>
              <h3 className="font-serif text-2xl font-normal text-on-background leading-tight">
                Quality Check
              </h3>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex justify-center items-center py-12 relative z-10">
          <Link
            href={`/${locale}/collections`}
            className="border border-on-background px-10 py-4 text-on-background hover:bg-on-background hover:text-surface-bright transition-colors duration-300 rounded-none text-label"
          >
            SHOP THE COLLECTION
          </Link>
        </section>
      </main>
    </div>
  )
}
