import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus, Search, Filter } from "lucide-react";
import { claims } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import type { ClaimStatus } from "@/types";

const STATUSES: ClaimStatus[] = ["Soumis", "En cours de vérification", "En analyse", "Documents manquants", "Accepté", "Refusé", "Payé"];

export default function FournisseurSinistres() {
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const all = claims.filter((c) => c.fournisseurId === "SUP-001");

  const filtered = useMemo(() => {
    return all.filter((c) =>
      (statut === "all" || c.statut === statut) &&
      (q === "" || c.reference.toLowerCase().includes(q.toLowerCase()) || c.cause.toLowerCase().includes(q.toLowerCase()))
    );
  }, [all, q, statut]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const items = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <AppLayout
      space="fournisseur"
      title="Mes sinistres"
      subtitle="Suivez et gérez vos déclarations"
      breadcrumbs={[{ label: "Fournisseur", to: "/fournisseur/dashboard" }, { label: "Sinistres" }]}
      actions={
        <Button asChild><Link to="/fournisseur/sinistres/nouveau"><Plus className="h-4 w-4 mr-2" />Déclarer un sinistre</Link></Button>
      }
    >
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Rechercher par référence ou cause..." className="pl-9" />
            </div>
            <Select value={statut} onValueChange={(v) => { setStatut(v); setPage(1); }}>
              <SelectTrigger className="w-full md:w-64"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 shadow-soft overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3">Référence</th>
                <th className="text-left px-6 py-3">Contrat</th>
                <th className="text-left px-6 py-3">Commande</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Cause</th>
                <th className="text-right px-6 py-3">Montant</th>
                <th className="text-left px-6 py-3">Statut</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-3 font-medium">{c.reference}</td>
                  <td className="px-6 py-3">{c.contrat}</td>
                  <td className="px-6 py-3">{c.commande}</td>
                  <td className="px-6 py-3 text-muted-foreground">{formatDate(c.dateDeclaration)}</td>
                  <td className="px-6 py-3">{c.cause}</td>
                  <td className="px-6 py-3 text-right">{formatXOF(c.montantReclame)}</td>
                  <td className="px-6 py-3"><StatusBadge status={c.statut} /></td>
                  <td className="px-6 py-3 text-right">
                    <Button asChild variant="ghost" size="sm"><Link to={`/fournisseur/sinistres/${c.id}`}>Détails</Link></Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">Aucun sinistre trouvé</td></tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-3 border-t border-border text-xs text-muted-foreground">
            <span>{filtered.length} résultat(s)</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Précédent</Button>
              <span className="px-3 py-1.5">Page {page} / {pages}</span>
              <Button size="sm" variant="outline" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}