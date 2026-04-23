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
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { claims } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import { Inbox, Check, X, MessageSquare, FileText, Download, Banknote, Archive } from "lucide-react";
import { toast } from "sonner";
import type { ClaimStatus } from "@/types";

const WORKFLOW = ["Réception", "Vérification contrat", "Analyse", "Décision", "Indemnisation", "Clôture"];

const STEP_OF: Record<ClaimStatus, number> = {
  "Soumis": 0,
  "En cours de vérification": 1,
  "En analyse": 2,
  "Documents manquants": 2,
  "Accepté": 3,
  "Refusé": 3,
  "Payé": 4,
};

export default function AdminSinistreDetail() {
  const { id } = useParams();
  const initial = claims.find((c) => c.id === id);

  const [statut, setStatut] = useState<ClaimStatus | "Clôturé">(initial?.statut ?? "Soumis");
  const [montant, setMontant] = useState(initial?.montantIndemnise ?? Math.round((initial?.montantReclame ?? 0) * 0.85));
  const [notes, setNotes] = useState(initial?.notesInternes ?? "");

  const [refuseOpen, setRefuseOpen] = useState(false);
  const [refuseReason, setRefuseReason] = useState("");
  const [docsOpen, setDocsOpen] = useState(false);
  const [docsList, setDocsList] = useState("");
  const [indemOpen, setIndemOpen] = useState(false);

  if (!initial) {
    return (
      <AppLayout space="admin" title="Introuvable">
        <EmptyState icon={Inbox} title="Sinistre introuvable" />
        <Button asChild className="mt-4" variant="outline"><Link to="/admin/sinistres">Retour</Link></Button>
      </AppLayout>
    );
  }

  const claim = initial;
  const stepIndex = statut === "Clôturé" ? 5 : statut === "Payé" ? 4 : STEP_OF[statut as ClaimStatus] ?? 0;

  const accept = () => { setStatut("Accepté"); toast.success("Sinistre accepté"); };
  const confirmRefuse = () => {
    if (refuseReason.trim().length < 5) { toast.error("Motif obligatoire (min 5 caractères)"); return; }
    setStatut("Refusé"); setRefuseOpen(false);
    toast.error("Sinistre refusé", { description: refuseReason });
  };
  const confirmDocs = () => {
    if (docsList.trim().length < 3) { toast.error("Indiquez les documents manquants"); return; }
    setStatut("Documents manquants"); setDocsOpen(false);
    toast.message("Demande de documents envoyée", { description: docsList });
  };
  const confirmIndem = () => {
    setStatut("Payé"); setIndemOpen(false);
    toast.success(`Indemnisation de ${formatXOF(montant)} validée`);
  };
  const markPaid = () => { setStatut("Payé"); toast.success("Marqué comme payé"); };
  const closeCase = () => { setStatut("Clôturé"); toast.success("Dossier clôturé et archivé"); };

  return (
    <AppLayout
      space="admin"
      title={claim.reference}
      subtitle={`${claim.fournisseur} · ${claim.cause}`}
      breadcrumbs={[{ label: "Sinistres", to: "/admin/sinistres" }, { label: claim.reference }]}
      actions={statut === "Clôturé" ? <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium"><Archive className="h-3 w-3 mr-1" />Clôturé</span> : <StatusBadge status={statut} />}
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
              {claim.montantIndemnise !== undefined && <Info label="Montant indemnisé" value={formatXOF(claim.montantIndemnise)} />}
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
                "Délai de déclaration respecté",
              ].map((item) => (
                <label key={item} className="flex items-center gap-3"><Checkbox defaultChecked /><span>{item}</span></label>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Notes internes</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Notes confidentielles à destination de l'équipe..." />
              <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.success("Notes enregistrées")}>Enregistrer les notes</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-soft border-primary/30">
            <CardHeader><CardTitle className="text-base">Indemnisation</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5"><Label className="text-xs">Montant proposé (XOF)</Label><Input type="number" value={montant} onChange={(e) => setMontant(Number(e.target.value))} /></div>
              <p className="text-xs text-muted-foreground">Soit {Math.round((montant / claim.montantReclame) * 100)}% du montant réclamé.</p>
              <Button className="w-full" onClick={() => setIndemOpen(true)} disabled={statut === "Payé" || statut === "Clôturé"}>
                <Banknote className="h-4 w-4 mr-2" />Valider l'indemnisation
              </Button>
              {statut === "Accepté" && (
                <Button variant="outline" className="w-full" onClick={markPaid}>Marquer comme payé</Button>
              )}
              {statut === "Payé" && (
                <Button variant="outline" className="w-full" onClick={closeCase}><Archive className="h-4 w-4 mr-2" />Clôturer le dossier</Button>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Décision</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full gap-2" onClick={accept} disabled={statut === "Refusé" || statut === "Payé" || statut === "Clôturé"}><Check className="h-4 w-4" />Accepter</Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => setDocsOpen(true)} disabled={statut === "Payé" || statut === "Clôturé"}><MessageSquare className="h-4 w-4" />Demander documents</Button>
              <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/40 hover:bg-destructive/10" onClick={() => setRefuseOpen(true)} disabled={statut === "Payé" || statut === "Clôturé"}><X className="h-4 w-4" />Refuser</Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Historique</CardTitle></CardHeader>
            <CardContent><WorkflowTimeline events={claim.timeline} /></CardContent>
          </Card>
        </div>
      </div>

      {/* Refuse modal */}
      <Dialog open={refuseOpen} onOpenChange={setRefuseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser le sinistre</DialogTitle>
            <DialogDescription>Le motif de refus sera communiqué au fournisseur. Soyez précis et factuel.</DialogDescription>
          </DialogHeader>
          <Textarea rows={5} value={refuseReason} onChange={(e) => setRefuseReason(e.target.value)} placeholder="Motif détaillé du refus..." />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefuseOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmRefuse}>Confirmer le refus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request documents modal */}
      <Dialog open={docsOpen} onOpenChange={setDocsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demander des documents</DialogTitle>
            <DialogDescription>Listez les pièces complémentaires requises. Le fournisseur recevra une notification.</DialogDescription>
          </DialogHeader>
          <Textarea rows={5} value={docsList} onChange={(e) => setDocsList(e.target.value)} placeholder="Ex: Bon de livraison signé, facture commerciale..." />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocsOpen(false)}>Annuler</Button>
            <Button onClick={confirmDocs}>Envoyer la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Indemnification modal */}
      <Dialog open={indemOpen} onOpenChange={setIndemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Valider l'indemnisation</DialogTitle>
            <DialogDescription>Confirmer le versement de l'indemnité au fournisseur.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted/30 p-4 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Bénéficiaire</span><strong>{claim.fournisseur}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Sinistre</span><strong>{claim.reference}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Montant</span><strong className="text-primary">{formatXOF(montant)}</strong></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIndemOpen(false)}>Annuler</Button>
            <Button onClick={confirmIndem}><Banknote className="h-4 w-4 mr-2" />Déclencher le paiement</Button>
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
      <p className="font-medium">{value}</p>
    </div>
  );
}