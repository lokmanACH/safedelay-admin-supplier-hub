import truck_hero from "/assets/hero_truck.jpg";

const features = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Souscription 100%",
    subtitle: "Sans papier, sans déplacement, Sans RDV",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286z" />
      </svg>
    ),
    title: "Couverture complète",
    subtitle: "Retards, pénalités, préjudices clients",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Indemnisation rapide",
    subtitle: "Traitement efficace des sinistres",
  },
];

export default function Hero() {
  return (
    <section className="relative w-full bg-[hsl(var(--background))] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-[hsl(var(--foreground))] tracking-tight">
              Sécurisez vos livraisons, <br className="hidden sm:block" />{" "}
              <span className="text-[hsl(var(--primary))]">protégez vos partenaires.</span>
            </h1>

            {/* Sub-copy */}
            <p className="text-[hsl(var(--muted-foreground))] text-base leading-relaxed max-w-md">
              Renforcez la confiance de vos clients grâce àune protection étendue contre les retards de livraison
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-4">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-2 min-w-[140px]">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-[hsl(var(--accent))] text-[hsl(var(--primary))]">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{f.title}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-snug">{f.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-[var(--shadow-elegant)] transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: "var(--gradient-primary)" }}
              >
                S'inscrire maintenant
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[hsl(var(--foreground))] bg-white border border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))] transition-colors"
              >
                Découvrir nos tarifs
              </button>
            </div>

          </div>

          {/* ── RIGHT COLUMN – image + cards ── */}
          <div className="relative order-1 lg:order-2 h-[340px] sm:h-[400px] lg:h-[460px]">

            {/* Truck image */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <img
                src={truck_hero}
                alt="Camion de livraison"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
            </div>

            {/* Coverage card */}
            <div
              className="absolute top-4 left-4 w-52 rounded-xl bg-white/95 backdrop-blur-sm p-4"
              style={{
                border: "1px solid hsl(var(--border))",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <p className="text-xs font-bold text-[hsl(var(--foreground))] mb-2">Couverture active</p>
              <ul className="flex flex-col gap-1.5">
                {["Retards de livraison", "Pénalités contractuelles", "Préjudices financiers", "Frais supplémentaires"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[hsl(var(--foreground))]">
                    <svg className="w-4 h-4 text-[hsl(var(--success))] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}