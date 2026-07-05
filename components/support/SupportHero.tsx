export default function SupportHero() {
  return (
    <section className="py-24 md:py-32 px-8 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-8 uppercase">
          SUPPORT CENTER
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-12">
          How can we help you today?
        </p>
        
        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto text-left mt-16">
          {/* Email Support */}
          <div className="border border-outline-variant/20 bg-surface-container-lowest/5 backdrop-blur-sm p-8 rounded-none flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-4 select-none" style={{ fontVariationSettings: "'wght' 300" }}>
                mail
              </span>
              <h3 className="text-on-surface-variant mb-3 text-label">
                EMAIL SUPPORT
              </h3>
              {/* TODO: If you get a domain email (e.g. support@nailestial.com), swap it here and in policy pages. */}
              <a 
                href="mailto:support@nailestial.com" 
                className="font-sans text-base text-primary hover:underline font-light"
              >
                support@nailestial.com
              </a>
            </div>
            <p className="text-on-surface-variant/70 mt-6 pt-4 border-t border-outline-variant/10 text-caption">
              We aim to respond within 1-2 business days.
            </p>
          </div>

          {/* Location */}
          <div className="border border-outline-variant/20 bg-surface-container-lowest/5 backdrop-blur-sm p-8 rounded-none flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-4 select-none" style={{ fontVariationSettings: "'wght' 300" }}>
                location_on
              </span>
              <h3 className="text-on-surface-variant mb-3 text-label">
                STUDIO ADDRESS
              </h3>
              <p className="font-sans text-base text-primary font-light">
                Ha Dong, Hanoi, Vietnam
              </p>
            </div>
            <p className="text-on-surface-variant/70 mt-6 pt-4 border-t border-outline-variant/10 text-caption">
              Vietnam-based Individual Seller
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
