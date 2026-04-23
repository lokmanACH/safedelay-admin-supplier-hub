import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { contracts } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import { Download } from "lucide-react";

export default function FournisseurContrats() {
  const mine = contracts.filter((c) => c.fournisseurId === "SUP-001");
  return (
    <AppLayout
      space="fournisseur"
      title="Mes contrats"
      subtitle="Liste de toutes vos polices d'assurance"
      breadcrumbs={[{ label: "Fournisseur", to: "/fournisseur/dashboard" }, { label: "Contrats" }]}
    >
      <Card className="shadow-soft overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3">Référence</th>
                <th className="text-left px-6 py-3">Période</th>
                <th className="text-right px-6 py-3">Prime annuelle</th>
                <th className="text-right px-6 py-3">Plafond garantie</th>
                <th className="text-left px-6 py-3">Statut</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {mine.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-3 font-medium">{c.reference}</td>
                  <td className="px-6 py-3 text-muted-foreground">{formatDate(c.dateDebut)} → {formatDate(c.dateFin)}</td>
                  <td className="px-6 py-3 text-right">{formatXOF(c.prime)}</td>
                  <td className="px-6 py-3 text-right">{formatXOF(c.plafondGarantie)}</td>
                  <td className="px-6 py-3"><StatusBadge status={c.statut} /></td>
                  <td className="px-6 py-3 text-right"><Button variant="ghost" size="sm"><Download className="h-4 w-4 mr-1" />PDF</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}