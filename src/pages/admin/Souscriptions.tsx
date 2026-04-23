import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { subscriptions } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import { Search, Filter } from "lucide-react";

export default function AdminSouscriptions() {
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState("all");

  const items = useMemo(() => subscriptions.filter((s) =>
    (statut === "all" || s.statut === statut) &&
    (q === "" || s.fournisseur.toLowerCase().includes(q.toLowerCase()) || s.reference.toLowerCase().includes(q.toLowerCase()))
  ), [q, statut]);

  return (
    <AppLayout
      space="admin"
      title="Souscriptions"
      subtitle="Examinez et validez les demandes des fournisseurs"
      breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Souscriptions" }]}
    >
      <Card className="shadow-soft">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un fournisseur..." className="pl-9" />
          </div>
          <Select value={statut} onValueChange={setStatut}>
            <SelectTrigger className="w-full md:w-56"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="Validée">Validée</SelectItem>
              <SelectItem value="Refusée">Refusée</SelectItem>
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
                <th className="text-left px-6 py-3">Entreprise</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Activité</th>
                <th className="text-right px-6 py-3">Prime</th>
                <th className="text-left px-6 py-3">Statut</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-3 font-medium">{s.reference}</td>
                  <td className="px-6 py-3">{s.fournisseur}</td>
                  <td className="px-6 py-3 text-muted-foreground">{formatDate(s.date)}</td>
                  <td className="px-6 py-3">{s.activite}</td>
                  <td className="px-6 py-3 text-right">{formatXOF(s.prime)}</td>
                  <td className="px-6 py-3"><StatusBadge status={s.statut} /></td>
                  <td className="px-6 py-3 text-right"><Button asChild variant="ghost" size="sm"><Link to={`/admin/souscriptions/${s.id}`}>Examiner</Link></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}