import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploadMock } from "@/components/shared/FileUploadMock";
import { contracts } from "@/data/mock";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const REQUIRED_DOCS = [
  "Bon de livraison original",
  "Facture commerciale",
  "Justificatif de pénalité",
  "Attestation officielle (port, douane, transporteur)",
];

export default function SinistreNouveau() {
  const nav = useNavigate();
  const myContracts = contracts.filter((c) => c.fournisseurId === "SUP-001" && c.statut === "Actif");
  const [contrat, setContrat] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contrat) { toast.error("Veuillez sélectionner un contrat"); return; }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Sinistre déclaré avec succès");
      nav("/fournisseur/sinistres");
    }, 600);
  };

  return (
    <AppLayout
      space="fournisseur"
      title="Déclarer un sinistre"
      subtitle="Renseignez les détails du retard pour ouvrir un dossier"
      breadcrumbs={[{ label: "Fournisseur", to: "/fournisseur/dashboard" }, { label: "Sinistres", to: "/fournisseur/sinistres" }, { label: "Nouveau" }]}
    >
      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">1. Informations générales</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Contrat concerné</Label>
                <Select value={contrat} onValueChange={setContrat}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    {myContracts.map((c) => <SelectItem key={c.id} value={c.id}>{c.reference}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Numéro de commande</Label><Input placeholder="CMD-..." required /></div>
              <div className="space-y-1.5"><Label className="text-xs">Date prévue de livraison</Label><Input type="date" required /></div>
              <div className="space-y-1.5"><Label className="text-xs">Date réelle de livraison</Label><Input type="date" required /></div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">2. Détails du retard</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Cause du retard</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Choisir une cause" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="port">Retard portuaire</SelectItem>
                      <SelectItem value="douane">Blocage douanier</SelectItem>
                      <SelectItem value="transport">Panne / incident transporteur</SelectItem>
                      <SelectItem value="meteo">Conditions météo</SelectItem>
                      <SelectItem value="amont">Retard fournisseur amont</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Nombre de jours de retard</Label><Input type="number" min={1} required /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Description détaillée</Label><Textarea rows={4} placeholder="Décrivez les circonstances du retard..." required /></div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">3. Impact financier</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Pénalités contractuelles (XOF)</Label><Input type="number" min={0} required /></div>
              <div className="space-y-1.5"><Label className="text-xs">Pertes annexes (XOF)</Label><Input type="number" min={0} /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Montant total réclamé (XOF)</Label><Input type="number" min={0} required /></div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">4. Documents justificatifs</CardTitle></CardHeader>
            <CardContent>
              <FileUploadMock />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Documents requis</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {REQUIRED_DOCS.map((d) => (
                <div key={d} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success shrink-0" /><span>{d}</span></div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-soft border-warning/40 bg-warning/5">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0" />
              <p className="text-xs text-foreground">Toute déclaration frauduleuse entraîne la résiliation du contrat. Vérifiez vos informations avant soumission.</p>
            </CardContent>
          </Card>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Envoi en cours..." : "Soumettre le sinistre"}
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}