interface ComparisonRow {
  metric: string
  nailestial: { text: string; isPositive: boolean }
  drugstore: { text: string; isPositive: boolean }
  salon: { text: string; isPositive: boolean }
}

const comparisonRows: ComparisonRow[] = [
  {
    metric: 'Material & Quality',
    nailestial: { text: 'Handcrafted Multi-Layer Gel', isPositive: true },
    drugstore: { text: 'Machine-Printed Plastic', isPositive: false },
    salon: { text: 'Liquid Acrylic / Gel Artistry', isPositive: true },
  },
  {
    metric: 'Application Time',
    nailestial: { text: 'Under 15 Minutes', isPositive: true },
    drugstore: { text: 'Under 15 Minutes', isPositive: true },
    salon: { text: '1.5 - 2 Hours at Salon', isPositive: false },
  },
  {
    metric: 'Reusability',
    nailestial: { text: 'Durable & Reusable (5+ wears)', isPositive: true },
    drugstore: { text: 'Single-Use (weak structure)', isPositive: false },
    salon: { text: 'Non-Reusable', isPositive: false },
  },
  {
    metric: 'Nail Damage',
    nailestial: { text: 'Zero Damage (gentle tabs/glue)', isPositive: true },
    drugstore: { text: 'Frequent Damage (harsh glues)', isPositive: false },
    salon: { text: 'High Damage (drilling & acetone)', isPositive: false },
  },
]

export default function ComparisonTable() {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-24 md:mb-32 relative z-10">
      
      {/* Title block */}
      <div className="text-center mb-16 md:mb-20">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-on-surface-variant mb-3 block">
          Compare the Difference
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-normal text-on-background tracking-normal">
          The Luxury Press-On Standard
        </h2>
      </div>

      {/* Desktop Layout: Premium Column Cards */}
      <div className="hidden md:flex flex-row gap-6 items-stretch pt-6">
        
        {/* Column 1: Row labels */}
        <div className="w-[20%] flex flex-col justify-between py-8 pr-4">
          {/* Spacer to match card header */}
          <div className="h-[110px]" />
          
          {comparisonRows.map((row, index) => (
            <div 
              key={index} 
              className="h-20 flex items-center text-left font-mono text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/80 border-t border-outline-variant/10"
            >
              {row.metric}
            </div>
          ))}
        </div>

        {/* Column 2: Nailestial (Hero Card) */}
        <div className="w-[28%] bg-white border border-primary shadow-ambient py-8 flex flex-col relative z-20 -mt-6 mb-2 rounded-none">
          {/* Standing Top Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white font-mono text-[9px] uppercase tracking-[0.25em] px-3.5 py-1 whitespace-nowrap">
            THE STANDARD
          </div>
          
          {/* Card Header */}
          <div className="h-[110px] flex flex-col items-center justify-center pb-6 text-center">
            <span className="font-serif text-2xl font-normal text-on-background tracking-wider">
              NAILESTIAL
            </span>
            <div className="mt-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-3 py-1 border border-primary/20 rounded-full text-on-surface font-semibold bg-on-surface/5">
                $$
              </span>
            </div>
          </div>

          {/* Row Values */}
          {comparisonRows.map((row, index) => (
            <div 
              key={index} 
              className="h-20 border-t border-outline-variant/10 flex flex-col justify-center items-center px-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-on-surface/5 text-on-surface mb-1.5 select-none">
                <span className="material-symbols-outlined text-[13px] font-bold">check</span>
              </div>
              <span className="font-mono text-[11px] text-on-background font-semibold leading-snug">
                {row.nailestial.text}
              </span>
            </div>
          ))}
        </div>

        {/* Column 3: Drugstore Press-Ons */}
        <div className="w-[26%] border border-outline-variant/15 bg-surface-container-lowest/5 py-8 flex flex-col opacity-70 hover:opacity-90 transition-opacity duration-300 rounded-none">
          
          {/* Card Header */}
          <div className="h-[110px] flex flex-col items-center justify-center pb-6 text-center">
            <span className="font-serif text-lg font-normal text-on-surface-variant tracking-wide">
              Drugstore Press-Ons
            </span>
            <div className="mt-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-3 py-1 border border-outline-variant/20 rounded-full text-on-surface-variant/70 bg-surface-container-low/40">
                $
              </span>
            </div>
          </div>

          {/* Row Values */}
          {comparisonRows.map((row, index) => (
            <div 
              key={index} 
              className="h-20 border-t border-outline-variant/10 flex flex-col justify-center items-center px-6 text-center"
            >
              {row.drugstore.isPositive ? (
                <div className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-on-surface/5 text-on-surface/80 mb-1.5 select-none">
                  <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 mb-1.5 select-none">
                  <span className="material-symbols-outlined text-[13px] font-bold">close</span>
                </div>
              )}
              <span className="font-mono text-[11px] text-on-surface-variant leading-snug">
                {row.drugstore.text}
              </span>
            </div>
          ))}
        </div>

        {/* Column 4: Salon Manicure */}
        <div className="w-[26%] border border-outline-variant/15 bg-surface-container-lowest/5 py-8 flex flex-col opacity-70 hover:opacity-90 transition-opacity duration-300 rounded-none">
          
          {/* Card Header */}
          <div className="h-[110px] flex flex-col items-center justify-center pb-6 text-center">
            <span className="font-serif text-lg font-normal text-on-surface-variant tracking-wide">
              Salon Manicure
            </span>
            <div className="mt-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-3 py-1 border border-outline-variant/20 rounded-full text-on-surface-variant/70 bg-surface-container-low/40">
                $$$
              </span>
            </div>
          </div>

          {/* Row Values */}
          {comparisonRows.map((row, index) => (
            <div 
              key={index} 
              className="h-20 border-t border-outline-variant/10 flex flex-col justify-center items-center px-6 text-center"
            >
              {row.salon.isPositive ? (
                <div className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-on-surface/5 text-on-surface/80 mb-1.5 select-none">
                  <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 mb-1.5 select-none">
                  <span className="material-symbols-outlined text-[13px] font-bold">close</span>
                </div>
              )}
              <span className="font-mono text-[11px] text-on-surface-variant leading-snug">
                {row.salon.text}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Mobile Layout: Stacked Cards */}
      <div className="block md:hidden space-y-8">
        
        {/* Nailestial Card */}
        <div className="border border-primary bg-white p-6 shadow-ambient relative rounded-none pt-10">
          {/* Top Badge */}
          <div className="absolute -top-3 left-6 bg-black text-white font-mono text-[9px] uppercase tracking-[0.25em] px-3 py-1">
            THE STANDARD
          </div>
          
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/10">
            <span className="font-serif text-xl font-normal text-on-background tracking-wider">
              NAILESTIAL
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-outline-variant/30 rounded-full text-on-surface font-semibold bg-on-surface/5">
              $$
            </span>
          </div>
          
          <ul className="space-y-5">
            {comparisonRows.map((row, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-on-surface/5 text-on-surface select-none mt-0.5">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
                    {row.metric}
                  </span>
                  <span className="font-mono text-xs text-on-background font-semibold mt-1">
                    {row.nailestial.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Drugstore Card */}
        <div className="border border-outline-variant/15 bg-surface-container-lowest/5 p-6 opacity-75">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/10">
            <span className="font-serif text-lg font-normal text-on-surface-variant tracking-wide">
              Drugstore Press-Ons
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-outline-variant/20 rounded-full text-on-surface-variant/70 bg-surface-container-low/40">
              $
            </span>
          </div>
          
          <ul className="space-y-5">
            {comparisonRows.map((row, index) => (
              <li key={index} className="flex items-start gap-3">
                {row.drugstore.isPositive ? (
                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-on-surface/5 text-on-surface/80 select-none mt-0.5">
                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none mt-0.5">
                    <span className="material-symbols-outlined text-[12px] font-bold">close</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
                    {row.metric}
                  </span>
                  <span className="font-mono text-xs text-on-surface-variant mt-1">
                    {row.drugstore.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Salon Card */}
        <div className="border border-outline-variant/15 bg-surface-container-lowest/5 p-6 opacity-75">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/10">
            <span className="font-serif text-lg font-normal text-on-surface-variant tracking-wide">
              Salon Manicure
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-outline-variant/20 rounded-full text-on-surface-variant/70 bg-surface-container-low/40">
              $$$
            </span>
          </div>
          
          <ul className="space-y-5">
            {comparisonRows.map((row, index) => (
              <li key={index} className="flex items-start gap-3">
                {row.salon.isPositive ? (
                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-on-surface/5 text-on-surface/80 select-none mt-0.5">
                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-outline-variant/10 text-on-surface-variant/30 select-none mt-0.5">
                    <span className="material-symbols-outlined text-[12px] font-bold">close</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
                    {row.metric}
                  </span>
                  <span className="font-mono text-xs text-on-surface-variant mt-1">
                    {row.salon.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
