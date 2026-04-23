import { Link, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { subscriptions } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import { Inbox, Check, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function AdminSouscriptionDetail() {
  const { id } = useParams();
  const sub = subscriptions.find((s) => s.id === id);

  if (!sub) {
    return (
      <AppLayout space="admin" title="Souscription introuvable">
        <EmptyState icon={Inbox} title="Souscription introuvable" />
        <Button asChild className="mt-4" variant="outline"><Link to="/admin/souscriptions">Retour</Link></Button>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      space="admin"
      title={sub.reference}
      subtitle={sub.fournisseur}
      breadcrumbs={[{ label: "Souscriptions", to: "/admin/souscriptions" }, { label: sub.reference }]}
      actions={<StatusBadge status={sub.statut} />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Détails de la demande</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              <Info label="Entreprise" value={sub.fournisseur} />
              <Info label="Date demande" value={formatDate(sub.date)} />
              <Info label="Activité" value={sub.activite} />
              <Info label="Chiffre d'affaires" value={formatXOF(sub.chiffreAffaires)} />
              <Info label="Délais habituels" value={sub.delaisHabituels} />
              <Info label="Historique retards" value={sub.historiqueRetards} />
              <Info label="Zones d'approvisionnement" value={sub.zonesApprovisionnement.join(", ")} full />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Évaluation du risque</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Score de risque" value="68 / 100" />
              <Row label="Niveau" value="Modéré" />
              <Row label="Prime calculée" value={formatXOF(sub.prime)} highlight />
              <Row label="Plafond garantie suggéré" value={formatXOF(sub.prime * 20)} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full gap-2" onClick={() => toast.success("Souscription validée")}><Check className="h-4 w-4" />Valider</Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => toast.message("Complément demandé")}><MessageSquare className="h-4 w-4" />Demander complément</Button>
              <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/40 hover:bg-destructive/10" onClick={() => toast.error("Souscription refusée")}><X className="h-4 w-4" />Refuser</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Info({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-base font-semibold text-primary" : "font-medium"}>{value}</span>
    </div>
  );
}