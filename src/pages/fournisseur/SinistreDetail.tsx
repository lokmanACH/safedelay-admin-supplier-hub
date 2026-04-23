import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WorkflowTimeline } from "@/components/shared/WorkflowTimeline";
import { EmptyState } from "@/components/shared/EmptyState";
import { FileUploadMock } from "@/components/shared/FileUploadMock";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { claims } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import { FileText, Download, AlertTriangle, Inbox, Banknote, XOctagon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SinistreDetail() {
  const { id } = useParams();
  const claim = claims.find((c) => c.id === id);
  const [uploadOpen, setUploadOpen] = useState(false);

  if (!claim) {
    return (
      <AppLayout space="fournisseur" title="Sinistre introuvable">
        <EmptyState icon={Inbox} title="Ce sinistre n'existe pas" description="La référence demandée est introuvable." />
        <div className="mt-4"><Button asChild variant="outline"><Link to="/fournisseur/sinistres">Retour</Link></Button></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      space="fournisseur"
      title={claim.reference}
      subtitle={`${claim.cause} · ${claim.joursRetard} jours de retard`}
      breadcrumbs={[{ label: "Sinistres", to: "/fournisseur/sinistres" }, { label: claim.reference }]}
      actions={<StatusBadge status={claim.statut} />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {claim.statut === "Refusé" && (
            <Card className="shadow-soft border-destructive/40 bg-destructive/5">
              <CardHeader className="flex flex-row items-center gap-2">
                <XOctagon className="h-4 w-4 text-destructive" />
                <CardTitle className="text-base">Sinistre refusé</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground">Motif communiqué par l'équipe SafeDelay :</p>
                <p className="mt-2 font-medium">{claim.timeline.find((t) => t.titre.toLowerCase().includes("refus"))?.description ?? "Cause non couverte par le contrat."}</p>
              </CardContent>
            </Card>
          )}

          {(claim.statut === "Accepté" || claim.statut === "Payé") && claim.montantIndemnise !== undefined && (
            <Card className="shadow-soft border-success/40 bg-success/5">
              <CardHeader className="flex flex-row items-center gap-2">
                {claim.statut === "Payé" ? <Banknote className="h-4 w-4 text-success" /> : <CheckCircle2 className="h-4 w-4 text-success" />}
                <CardTitle className="text-base">{claim.statut === "Payé" ? "Indemnisation versée" : "Indemnisation acceptée"}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm flex items-center justify-between">
                <p className="text-muted-foreground">Montant {claim.statut === "Payé" ? "versé" : "validé"}</p>
                <p className="text-lg font-semibold text-success">{formatXOF(claim.montantIndemnise)}</p>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Résumé du sinistre</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              <Info label="Contrat" value={claim.contrat} />
              <Info label="Commande" value={claim.commande} />
              <Info label="Date de déclaration" value={formatDate(claim.dateDeclaration)} />
              <Info label="Jours de retard" value={`${claim.joursRetard} jours`} />
              <Info label="Montant réclamé" value={formatXOF(claim.montantReclame)} />
              {claim.montantIndemnise !== undefined && <Info label="Montant indemnisé" value={formatXOF(claim.montantIndemnise)} />}
              <div className="sm:col-span-2"><Info label="Description" value={claim.description} /></div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Pièces jointes</CardTitle></CardHeader>
            <CardContent>
              {claim.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune pièce jointe.</p>
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
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4 mr-1" />Télécharger</Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {claim.documentsManquants && claim.documentsManquants.length > 0 && (
            <Card className="shadow-soft border-warning/40 bg-warning/5">
              <CardHeader className="flex flex-row items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <CardTitle className="text-base">Documents manquants</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {claim.documentsManquants.map((d) => <li key={d}>{d}</li>)}
                </ul>
                <Button className="mt-4" size="sm" onClick={() => setUploadOpen(true)}>Téléverser les documents</Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Statut</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <StatusBadge status={claim.statut} />
              <p className="text-xs text-muted-foreground">Dernière mise à jour le {formatDate(claim.timeline[claim.timeline.length - 1].date)}.</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Historique</CardTitle></CardHeader>
            <CardContent><WorkflowTimeline events={claim.timeline} /></CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Téléverser des documents</DialogTitle>
            <DialogDescription>Ajoutez les pièces complémentaires demandées par l'équipe SafeDelay.</DialogDescription>
          </DialogHeader>
          <FileUploadMock />
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Annuler</Button>
            <Button onClick={() => { setUploadOpen(false); toast.success("Documents transmis"); }}>Envoyer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}