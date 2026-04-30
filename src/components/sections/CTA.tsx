import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-7xl mx-auto rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{ background: "var(--gradient-primary)" }}
      >
        {/* Left – icon + text */}
        <div className="flex items-center gap-5">
          {/* Shield icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white/15">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286z" />
            </svg>
          </div>

          <div>
            <p className="text-white font-bold text-lg leading-snug">
              Prêt à sécuriser votre activité ?
            </p>
            <p className="text-white/75 text-sm mt-0.5">
              Rejoignez des centaines d'entreprises qui nous font déjà confiance.
            </p>
          </div>
        </div>

        {/* Right – CTA button */}
        <Link
          to="/signup"
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[hsl(var(--primary))] bg-white hover:bg-white/90 transition-colors"
        >
          Souscrire maintenant
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </section>
  );
}