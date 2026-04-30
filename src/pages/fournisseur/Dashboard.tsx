import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSignature, AlertTriangle, CheckCircle2, Wallet, Plus, FileUp, Files } from "lucide-react";
import { Link } from "react-router-dom";
import { contracts, claims, claimsMonthly } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function FournisseurDashboard() {
  const myClaims = claims.filter((c) => c.fournisseurId === "SUP-001");
  const enCours = myClaims.filter((c) => !["Accepté", "Refusé", "Payé"].includes(c.statut)).length;
  const acceptes = myClaims.filter((c) => c.statut === "Accepté" || c.statut === "Payé").length;
  const totalIndemnise = myClaims.reduce((s, c) => s + (c.montantIndemnise ?? 0), 0);
  const actifs = contracts.filter((c) => c.fournisseurId === "SUP-001" && c.statut === "Actif").length;

  return (
    <AppLayout
      space="fournisseur"
      title="Bonjour, Sahel Logistique 👋"
      subtitle="Voici un aperçu de votre activité d'assurance"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard label="Contrats actifs" value={actifs} icon={FileSignature} accent="primary" hint={`${contracts.filter(c=>c.fournisseurId==="SUP-001").length} au total`} />
        <DashboardCard label="Sinistres en cours" value={enCours} icon={AlertTriangle} accent="warning" trend={{ value: "12%", positive: false }} />
        <DashboardCard label="Sinistres acceptés" value={acceptes} icon={CheckCircle2} accent="success" trend={{ value: "8%", positive: true }} />
        <DashboardCard label="Total indemnisé" value={formatXOF(totalIndemnise)} icon={Wallet} accent="info" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Évolution des sinistres</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={claimsMonthly}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mois" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="soumis" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#g1)" name="Soumis" />
                <Area type="monotone" dataKey="payes" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#g2)" name="Payés" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link to="/fournisseur/sinistres/nouveau"><FileUp className="h-4 w-4" /> Déclarer un sinistre</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link to="/fournisseur/documents"><Files className="h-4 w-4" /> Voir mes documents</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Sinistres récents</CardTitle>
          <Button asChild variant="ghost" size="sm"><Link to="/fournisseur/sinistres">Tout voir →</Link></Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3">Référence</th>
                <th className="text-left px-6 py-3">Cause</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-right px-6 py-3">Montant</th>
                <th className="text-left px-6 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {myClaims.slice(0, 5).map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-3 font-medium">
                    <Link to={`/fournisseur/sinistres/${c.id}`} className="text-primary hover:underline">{c.reference}</Link>
                  </td>
                  <td className="px-6 py-3">{c.cause}</td>
                  <td className="px-6 py-3 text-muted-foreground">{formatDate(c.dateDeclaration)}</td>
                  <td className="px-6 py-3 text-right">{formatXOF(c.montantReclame)}</td>
                  <td className="px-6 py-3"><StatusBadge status={c.statut} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}