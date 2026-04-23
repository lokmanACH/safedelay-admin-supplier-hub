import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { documents } from "@/data/mock";
import { formatDate } from "@/lib/format";
import { Download, FileText } from "lucide-react";

export default function FournisseurDocuments() {
  return (
    <AppLayout
      space="fournisseur"
      title="Mes documents"
      subtitle="Tous vos contrats, attestations et pièces de sinistres"
      breadcrumbs={[{ label: "Fournisseur", to: "/fournisseur/dashboard" }, { label: "Documents" }]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((d) => (
          <Card key={d.id} className="shadow-soft hover:shadow-card transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-3"><FileText className="h-5 w-5 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{d.nom}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.categorie} · {d.taille}</p>
                  <p className="text-xs text-muted-foreground">Ajouté le {formatDate(d.date)}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4"><Download className="h-4 w-4 mr-2" />Télécharger</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}