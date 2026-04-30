const steps = [
  {
    number: 1,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Créez votre compte",
    description: "Inscrivez-vous en quelques secondes et confirmez votre email.",
  },
  {
    number: 2,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    title: "Informations entreprise",
    description: "Renseignez les informations de votre entreprise et votre activité.",
  },
  {
    number: 3,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5l1.5 1.5-3 3" />
      </svg>
    ),
    title: "Évaluation du risque",
    description: "Répondez à quelques questions sur votre activité et vos antécédents.",
  },
  {
    number: 4,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-4.493h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.504-4.493h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm4.5-9.747V4.875c0-.621-.504-1.125-1.125-1.125H4.875C4.254 3.75 3.75 4.254 3.75 4.875v14.25c0 .621.504 1.125 1.125 1.125h6.375" />
      </svg>
    ),
    title: "Simulation de prime",
    description: "Découvrez votre prime personnalisée instantanément avec le détail des paramètres.",
  },
  {
    number: 5,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: "Paiement & signature",
    description: "Validez votre contrat et effectuez le paiement en ligne sécurisé.",
  },
  {
    number: 6,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286z" />
      </svg>
    ),
    title: "Contrat actif",
    description: "Recevez votre contrat et commencez à être protégé.",
  },
];

export default function How() {
  return (
    <section className="w-full bg-[hsl(var(--background))] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-[hsl(var(--primary))] mb-3">
            Comment ça marche ?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight">
            Un parcours simple en 6 étapes
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">

          {/* Dashed connector line — desktop only */}
          <div
            className="hidden lg:block absolute top-10 left-[calc(100%/12)] right-[calc(100%/12)] h-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, hsl(var(--border)) 0, hsl(var(--border)) 6px, transparent 6px, transparent 14px)",
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center gap-3">

                {/* Icon circle */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-[hsl(var(--primary))]"
                    style={{
                      background: "hsl(var(--accent))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Step number badge */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white -mt-3 z-10"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-bold text-[hsl(var(--foreground))]">{step.title}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}