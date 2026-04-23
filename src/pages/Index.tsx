import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Building2, Settings2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">SafeDelay</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">Produit</a>
          <a href="#" className="hover:text-foreground">Tarifs</a>
          <a href="#" className="hover:text-foreground">À propos</a>
        </nav>
      </header>

      <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto text-center">
        <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
          Assurance retards de livraison · Afrique de l'Ouest
        </span>
        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          Couvrez vos retards.<br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">Protégez vos marges.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          SafeDelay indemnise les fournisseurs et importateurs face aux pénalités liées aux retards portuaires, douaniers et logistiques.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Link to="/fournisseur/dashboard" className="group rounded-2xl border border-border bg-card p-6 text-left shadow-card hover:shadow-elegant transition-shadow">
            <Building2 className="h-6 w-6 text-primary" />
            <p className="mt-3 font-semibold">Espace Fournisseur</p>
            <p className="mt-1 text-sm text-muted-foreground">Souscrire, déclarer un sinistre, suivre vos contrats.</p>
            <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium">
              Accéder <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link to="/admin/dashboard" className="group rounded-2xl border border-border bg-card p-6 text-left shadow-card hover:shadow-elegant transition-shadow">
            <Settings2 className="h-6 w-6 text-primary" />
            <p className="mt-3 font-semibold">Console Admin</p>
            <p className="mt-1 text-sm text-muted-foreground">Valider les souscriptions, traiter les sinistres, piloter.</p>
            <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium">
              Accéder <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="mt-12">
          <Button asChild size="lg" className="bg-gradient-primary shadow-elegant">
            <Link to="/fournisseur/souscription">Démarrer une souscription</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
