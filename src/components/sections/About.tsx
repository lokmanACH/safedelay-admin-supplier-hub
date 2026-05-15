import truck_about from "/assets/truck_about.jpg";

const checks = [
  "Spécialisés dans l'assurance RC étendue avec garantie retard",
  "Technologie moderne pour une expérience 100% digitale",
  "Équipe d'experts dédiée à votre protection et votre croissance",
];

const CheckCircle = () => (
  <svg className="w-5 h-5 text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function About() {
  return (
    <section className="w-full bg-[hsl(var(--background))] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="relative">

            {/* Image */}
            <div className="rounded-2xl overflow-hidden h-[280px] sm:h-[340px] lg:h-[380px]">
              <img
                src={truck_about}
                alt="Entrepôt logistique SafeDelay"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Mission card – overlaps the bottom of the image */}
            <div
              className="absolute -bottom-6 left-4 right-4 sm:left-8 sm:right-8 flex items-start gap-4 rounded-2xl bg-white px-5 py-4"
              style={{
                border: "1px solid hsl(var(--border))",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Icon badge */}
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--primary))]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-bold text-[hsl(var(--foreground))] mb-0.5">Notre mission</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                  Sécuriser votre activité et renforcer la confiance dans vos engagements de livraison.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN – image + mission card ── */}
          <div className="flex flex-col gap-6">

            {/* Eyebrow */}
            <p className="text-xs font-bold tracking-widest uppercase text-[hsl(var(--primary))]">
              À propos de SafeDelay
            </p>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[hsl(var(--foreground))] tracking-tight">
              Votre partenaire de confiance contre les aléas de livraison
            </h2>

            {/* Body */}
            <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed max-w-md">
              Notre extension de garantie  en responsabilité civile professionnelle couvre les 
              conséquences financières des retards de livraison, assurant ainsi une protection 
              complète des tiers impactés.
            </p>

            {/* Checklist */}
            <ul className="flex flex-col gap-3">
              {checks.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[hsl(var(--foreground))]">
                  <CheckCircle />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[hsl(var(--foreground))] bg-white border border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))] transition-colors"
              >
                En savoir plus sur nous
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}