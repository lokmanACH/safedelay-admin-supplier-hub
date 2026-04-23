import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { claims, suppliers } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import { Search } from "lucide-react";
import type { ClaimStatus } from "@/types";

const STATUSES: ClaimStatus[] = ["Soumis", "En cours de vérification", "En analyse", "Documents manquants", "Accepté", "Refusé", "Payé"];
const CAUSES = ["Retard portuaire", "Blocage douanier", "Panne transporteur", "Conditions météo", "Retard fournisseur amont"];

export default function AdminSinistres() {
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState("all");
  const [fournisseur, setFournisseur] = useState("all");
  const [cause, setCause] = useState("all");

  const items = useMemo(() => claims.filter((c) =>
    (statut === "all" || c.statut === statut) &&
    (fournisseur === "all" || c.fournisseurId === fournisseur) &&
    (cause === "all" || c.cause === cause) &&
    (q === "" || c.reference.toLowerCase().includes(q.toLowerCase()))
  ), [q, statut, fournisseur, cause]);

  return (
    <AppLayout
      space="admin"
      title="Sinistres"
      subtitle="Tous les dossiers de la plateforme"
      breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Sinistres" }]}
    >
      <Card className="shadow-soft">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="pl-9" />
          </div>
          <Select value={fournisseur} onValueChange={setFournisseur}>
            <SelectTrigger><SelectValue placeholder="Fournisseur" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les fournisseurs</SelectItem>
              {suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.raisonSociale}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statut} onValueChange={setStatut}>
            <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={cause} onValueChange={setCause}>
            <SelectTrigger className="md:col-span-1"><SelectValue placeholder="Cause" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les causes</SelectItem>
              {CAUSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mt-4 shadow-soft overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3">Référence</th>
                <th className="text-left px-6 py-3">Fournisseur</th>
                <th className="text-left px-6 py-3">Cause</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-right px-6 py-3">Montant</th>
                <th className="text-left px-6 py-3">Statut</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-3 font-medium">{c.reference}</td>
                  <td className="px-6 py-3">{c.fournisseur}</td>
                  <td className="px-6 py-3">{c.cause}</td>
                  <td className="px-6 py-3 text-muted-foreground">{formatDate(c.dateDeclaration)}</td>
                  <td className="px-6 py-3 text-right">{formatXOF(c.montantReclame)}</td>
                  <td className="px-6 py-3"><StatusBadge status={c.statut} /></td>
                  <td className="px-6 py-3 text-right"><Button asChild variant="ghost" size="sm"><Link to={`/admin/sinistres/${c.id}`}>Traiter</Link></Button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">Aucun résultat</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}