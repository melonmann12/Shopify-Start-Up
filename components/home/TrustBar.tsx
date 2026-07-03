export default function TrustBar() {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-24 md:mb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-outline-variant/20">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant" data-icon="cut">cut</span>
          <h3 className="font-headline font-bold text-sm tracking-widest uppercase text-on-surface">PREMIUM CRAFT</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant" data-icon="public">public</span>
          <h3 className="font-headline font-bold text-sm tracking-widest uppercase text-on-surface">GLOBAL LOGISTICS</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant" data-icon="lock">lock</span>
          <h3 className="font-headline font-bold text-sm tracking-widest uppercase text-on-surface">SECURED CHECKOUT</h3>
        </div>
      </div>
    </section>
  )
}
