import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function ReglesTarifaires() {
  const [tauxBase, setTauxBase] = useState([0.35]);
  const [majorationRisque, setMajorationRisque] = useState([15]);
  const [franchise, setFranchise] = useState(250000);

  return (
    <AppLayout
      space="admin"
      title="Règles tarifaires"
      subtitle="Paramétrage du calcul des primes et franchises"
      breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Règles" }]}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Tarification</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2"><Label className="text-xs">Taux de base (% du CA)</Label><span className="text-sm font-semibold text-primary">{tauxBase[0].toFixed(2)}%</span></div>
              <Slider value={tauxBase} onValueChange={setTauxBase} min={0.1} max={1} step={0.05} />
            </div>
            <div>
              <div className="flex justify-between mb-2"><Label className="text-xs">Majoration risque élevé (%)</Label><span className="text-sm font-semibold text-primary">+{majorationRisque[0]}%</span></div>
              <Slider value={majorationRisque} onValueChange={setMajorationRisque} min={0} max={50} step={1} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Franchise minimale (XOF)</Label>
              <Input type="number" value={franchise} onChange={(e) => setFranchise(Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Couverture</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Toggle label="Retards portuaires" defaultChecked />
            <Toggle label="Blocages douaniers" defaultChecked />
            <Toggle label="Pannes transporteur" defaultChecked />
            <Toggle label="Conditions météorologiques" />
            <Toggle label="Cas de force majeure" />
            <Toggle label="Retards fournisseurs amont" defaultChecked />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={() => toast.success("Règles enregistrées")}>Enregistrer les règles</Button>
      </div>
    </AppLayout>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-0">
      <span>{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}