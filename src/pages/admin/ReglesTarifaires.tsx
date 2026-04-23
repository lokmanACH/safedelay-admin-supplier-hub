import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { formatXOF } from "@/lib/format";
import { Sparkles, Save, History } from "lucide-react";
import { toast } from "sonner";

const CAUSES = [
  { key: "port", label: "Retards portuaires", default: true },
  { key: "douane", label: "Blocages douaniers", default: true },
  { key: "transport", label: "Pannes transporteur", default: true },
  { key: "meteo", label: "Conditions météorologiques", default: false },
  { key: "force", label: "Cas de force majeure", default: false },
  { key: "amont", label: "Retards fournisseurs amont", default: true },
] as const;

export default function ReglesTarifaires() {
  const [tauxBase, setTauxBase] = useState([0.35]);
  const [majorationRisque, setMajorationRisque] = useState([15]);
  const [franchise, setFranchise] = useState(250000);
  const [plafondMultiple, setPlafondMultiple] = useState([20]);
  const [retardMin, setRetardMin] = useState(2);
  const [delaiDeclaration, setDelaiDeclaration] = useState(30);
  const [causes, setCauses] = useState<Record<string, boolean>>(
    Object.fromEntries(CAUSES.map((c) => [c.key, c.default]))
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date(Date.now() - 86400000 * 3));

  // Simulation
  const [caSim, setCaSim] = useState(1_000_000_000);
  const [retardsSim, setRetardsSim] = useState(10);

  const sim = useMemo(() => {
    const base = Math.round(caSim * (tauxBase[0] / 100));
    const surchargeRate = retardsSim > 15 ? majorationRisque[0] / 100 : retardsSim > 8 ? majorationRisque[0] / 200 : 0;
    const surcharge = Math.round(base * surchargeRate);
    const total = base + surcharge;
    const plafond = total * plafondMultiple[0];
    return { base, surcharge, total, plafond };
  }, [caSim, retardsSim, tauxBase, majorationRisque, plafondMultiple]);

  const save = () => {
    setLastUpdated(new Date());
    toast.success("Règles tarifaires enregistrées");
  };

  return (
    <AppLayout
      space="admin"
      title="Règles tarifaires"
      subtitle="Paramétrage du calcul des primes, franchises et seuils métier"
      breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Règles" }]}
      actions={
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <History className="h-3.5 w-3.5" />Dernière mise à jour : {lastUpdated.toLocaleString("fr-FR")}
            </span>
          )}
          <Button onClick={save}><Save className="h-4 w-4 mr-2" />Enregistrer</Button>
        </div>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Calcul de la prime</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2"><Label className="text-xs">Taux de base (% du CA)</Label><span className="text-sm font-semibold text-primary">{tauxBase[0].toFixed(2)}%</span></div>
                <Slider value={tauxBase} onValueChange={setTauxBase} min={0.1} max={1} step={0.05} />
              </div>
              <div>
                <div className="flex justify-between mb-2"><Label className="text-xs">Majoration risque élevé (max)</Label><span className="text-sm font-semibold text-primary">+{majorationRisque[0]}%</span></div>
                <Slider value={majorationRisque} onValueChange={setMajorationRisque} min={0} max={50} step={1} />
              </div>
              <div>
                <div className="flex justify-between mb-2"><Label className="text-xs">Plafond garantie (× prime)</Label><span className="text-sm font-semibold text-primary">×{plafondMultiple[0]}</span></div>
                <Slider value={plafondMultiple} onValueChange={setPlafondMultiple} min={5} max={50} step={1} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Franchise minimale (XOF)</Label>
                  <Input type="number" value={franchise} onChange={(e) => setFranchise(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Seuils métier</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Retard minimum couvert (jours)</Label>
                <Input type="number" min={1} value={retardMin} onChange={(e) => setRetardMin(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Délai max de déclaration après incident (jours)</Label>
                <Input type="number" min={1} value={delaiDeclaration} onChange={(e) => setDelaiDeclaration(Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Causes couvertes</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {CAUSES.map((c) => (
                <div key={c.key} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <span>{c.label}</span>
                  <Switch checked={causes[c.key]} onCheckedChange={(v) => setCauses((s) => ({ ...s, [c.key]: v }))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-soft border-primary/30 sticky top-6">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Simulation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">CA test (XOF)</Label>
                <Input type="number" value={caSim} onChange={(e) => setCaSim(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Retards 12 mois (%)</Label>
                <Input type="number" value={retardsSim} onChange={(e) => setRetardsSim(Number(e.target.value))} />
              </div>
              <div className="rounded-lg bg-muted/40 p-4 space-y-2 text-sm">
                <Row label="Base" value={formatXOF(sim.base)} />
                <Row label="Surcharge" value={formatXOF(sim.surcharge)} />
                <Row label="Franchise" value={formatXOF(franchise)} />
                <Row label="Plafond garantie" value={formatXOF(sim.plafond)} />
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="font-semibold">Prime totale</span>
                  <span className="font-semibold text-primary">{formatXOF(sim.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}