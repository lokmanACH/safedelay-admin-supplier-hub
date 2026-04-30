const features = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021" />
      </svg>
    ),
    title: "Couverture étendue",
    description:
      "Protection contre les pénalités de retard, pertes financières et préjudices clients.",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l2.5 2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5l1.5-1.5" />
      </svg>
    ),
    title: "Souscription rapide",
    description:
      "Obtenez votre contrat en quelques minutes, 100% en ligne.",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="3" width="16" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 13h4" />
        <rect x="8" y="16" width="2" height="2" rx="0.5" />
        <rect x="11" y="16" width="2" height="2" rx="0.5" />
        <rect x="14" y="16" width="2" height="2" rx="0.5" />
      </svg>
    ),
    title: "Tarification juste",
    description:
      "Prime calculée selon votre profil de risque réel et vos données métier.",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v5a1 1 0 001 1h5" />
      </svg>
    ),
    title: "Gestion simplifiée",
    description:
      "Déclarez vos sinistres et suivez-les en temps réel depuis votre espace.",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 14h4M6 17h2" />
        <rect x="14" y="13" width="6" height="5" rx="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Indemnisation efficace",
    description:
      "Processus d'indemnisation rapide et transparent.",
  },
];

export default function Why() {
  return (
    <section className="w-full bg-[hsl(var(--background))] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-[hsl(var(--primary))] mb-3">
            Pourquoi choisir SafeDelay ?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight">
            Une protection pensée pour votre activité
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-[hsl(var(--border))] hover:shadow-[var(--shadow-card)] transition-shadow duration-200"
            >
              <div className="text-[hsl(var(--primary))]">
                {f.icon}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-[hsl(var(--foreground))]">{f.title}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}