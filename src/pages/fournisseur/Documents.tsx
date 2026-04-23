import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { documents } from "@/data/mock";
import { formatDate } from "@/lib/format";
import { Download, FileText, Search, Filter, FileSignature, Receipt, ShieldCheck, AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { toast } from "sonner";

const CATEGORIES = ["Contrat", "Attestation", "Sinistre", "Facture"] as const;

const ICONS: Record<string, { icon: typeof FileText; tone: string }> = {
  Contrat: { icon: FileSignature, tone: "bg-primary/10 text-primary" },
  Attestation: { icon: ShieldCheck, tone: "bg-info/10 text-info" },
  Sinistre: { icon: AlertTriangle, tone: "bg-warning/10 text-warning" },
  Facture: { icon: Receipt, tone: "bg-success/10 text-success" },
};

export default function FournisseurDocuments() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const items = useMemo(() => documents.filter((d) =>
    (cat === "all" || d.categorie === cat) &&
    (q === "" || d.nom.toLowerCase().includes(q.toLowerCase()) || (d.reference ?? "").toLowerCase().includes(q.toLowerCase()))
  ), [q, cat]);

  return (
    <AppLayout
      space="fournisseur"
      title="Mes documents"
      subtitle="Tous vos contrats, attestations et pièces de sinistres"
      breadcrumbs={[{ label: "Fournisseur", to: "/fournisseur/dashboard" }, { label: "Documents" }]}
    >
      <Card className="shadow-soft">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher par nom ou référence..." className="pl-9" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-full md:w-56"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <Card className="shadow-soft mt-4"><CardContent className="py-12"><EmptyState icon={FileText} title="Aucun document" description="Aucun document ne correspond à votre recherche." /></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {items.map((d) => {
            const cfg = ICONS[d.categorie];
            const Icon = cfg.icon;
            return (
              <Card key={d.id} className="shadow-soft hover:shadow-card transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-lg p-3 ${cfg.tone}`}><Icon className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{d.nom}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{d.categorie} · {d.taille}</p>
                      {d.reference && <p className="text-xs text-primary mt-0.5 truncate">↳ {d.reference}</p>}
                      <p className="text-xs text-muted-foreground">Ajouté le {formatDate(d.date)}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => toast.success(`${d.nom} téléchargé (démo)`)}>
                    <Download className="h-4 w-4 mr-2" />Télécharger
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}