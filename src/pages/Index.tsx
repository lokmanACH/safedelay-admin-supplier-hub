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
        <div>
          <Link to="/signin" className="text-sm font-medium text-primary border border-primary rounded-md px-4 py-2 ml-4">
            Se connecter
          </Link>
          <Link to="/signup" className="bg-gradient-primary shadow-elegant text-sm font-medium text-primary-foreground rounded-md px-4 py-2 ml-4">
            S'inscrire
          </Link>
        </div>
      </header>

      <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto text-center">
        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          Couvrez vos retards.<br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">Protégez vos marges.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          SafeDelay indemnise les fournisseurs et importateurs face aux pénalités liées aux retards portuaires, douaniers et logistiques.
        </p>


        <div className="mt-12">
          <Button asChild size="lg" className="bg-gradient-primary shadow-elegant">
            <Link to="/signup">Démarrer une souscription</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
