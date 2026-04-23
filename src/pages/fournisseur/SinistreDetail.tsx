import { Link, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WorkflowTimeline } from "@/components/shared/WorkflowTimeline";
import { EmptyState } from "@/components/shared/EmptyState";
import { claims } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import { FileText, Download, AlertTriangle, Inbox } from "lucide-react";

export default function SinistreDetail() {
  const { id } = useParams();
  const claim = claims.find((c) => c.id === id);

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
                <Button className="mt-4" size="sm">Téléverser les documents</Button>
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