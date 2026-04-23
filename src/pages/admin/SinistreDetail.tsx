import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stepper } from "@/components/shared/Stepper";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WorkflowTimeline } from "@/components/shared/WorkflowTimeline";
import { EmptyState } from "@/components/shared/EmptyState";
import { Checkbox } from "@/components/ui/checkbox";
import { claims } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import { Inbox, Check, X, MessageSquare, FileText, Download } from "lucide-react";
import { toast } from "sonner";

const WORKFLOW = ["Réception", "Vérification contrat", "Analyse", "Décision", "Indemnisation", "Clôture"];

export default function AdminSinistreDetail() {
  const { id } = useParams();
  const claim = claims.find((c) => c.id === id);
  const [montant, setMontant] = useState(claim?.montantIndemnise ?? Math.round((claim?.montantReclame ?? 0) * 0.85));
  const [notes, setNotes] = useState(claim?.notesInternes ?? "");

  if (!claim) {
    return (
      <AppLayout space="admin" title="Introuvable">
        <EmptyState icon={Inbox} title="Sinistre introuvable" />
        <Button asChild className="mt-4" variant="outline"><Link to="/admin/sinistres">Retour</Link></Button>
      </AppLayout>
    );
  }

  const stepIndex = (() => {
    const map: Record<string, number> = {
      "Soumis": 0, "En cours de vérification": 1, "En analyse": 2, "Documents manquants": 2,
      "Accepté": 3, "Refusé": 3, "Payé": 4,
    };
    return map[claim.statut] ?? 0;
  })();

  return (
    <AppLayout
      space="admin"
      title={claim.reference}
      subtitle={`${claim.fournisseur} · ${claim.cause}`}
      breadcrumbs={[{ label: "Sinistres", to: "/admin/sinistres" }, { label: claim.reference }]}
      actions={<StatusBadge status={claim.statut} />}
    >
      <Card className="shadow-soft">
        <CardContent className="p-6"><Stepper steps={WORKFLOW} current={stepIndex} /></CardContent>
      </Card>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Données du sinistre</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              <Info label="Fournisseur" value={claim.fournisseur} />
              <Info label="Contrat" value={claim.contrat} />
              <Info label="Commande" value={claim.commande} />
              <Info label="Date" value={formatDate(claim.dateDeclaration)} />
              <Info label="Cause" value={claim.cause} />
              <Info label="Jours de retard" value={`${claim.joursRetard} jours`} />
              <Info label="Montant réclamé" value={formatXOF(claim.montantReclame)} />
              <div className="sm:col-span-2"><Info label="Description" value={claim.description} /></div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Pièces jointes</CardTitle></CardHeader>
            <CardContent>
              {claim.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune pièce.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {claim.documents.map((d) => (
                    <li key={d.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2"><FileText className="h-4 w-4 text-primary" /></div>
                        <div>
                          <p className="text-sm font-medium">{d.nom}</p>
                          <p className="text-xs text-muted-foreground">{d.type} · {d.taille}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Checklist de vérification</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                "Contrat actif au moment du sinistre",
                "Cause couverte par le contrat",
                "Documents justificatifs reçus",
                "Montant cohérent avec les pénalités",
                "Aucun antécédent suspect",
              ].map((item) => (
                <label key={item} className="flex items-center gap-3"><Checkbox defaultChecked /><span>{item}</span></label>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Notes internes</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Notes confidentielles à destination de l'équipe..." />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-soft border-primary/30">
            <CardHeader><CardTitle className="text-base">Indemnisation</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5"><Label className="text-xs">Montant proposé (XOF)</Label><Input type="number" value={montant} onChange={(e) => setMontant(Number(e.target.value))} /></div>
              <p className="text-xs text-muted-foreground">Soit {Math.round((montant / claim.montantReclame) * 100)}% du montant réclamé.</p>
              <Button className="w-full" onClick={() => toast.success("Indemnisation validée")}>Valider l'indemnisation</Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Décision</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full gap-2" onClick={() => toast.success("Sinistre accepté")}><Check className="h-4 w-4" />Accepter</Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => toast.message("Complément demandé")}><MessageSquare className="h-4 w-4" />Demander documents</Button>
              <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/40 hover:bg-destructive/10" onClick={() => toast.error("Sinistre refusé")}><X className="h-4 w-4" />Refuser</Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Historique</CardTitle></CardHeader>
            <CardContent><WorkflowTimeline events={claim.timeline} /></CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}