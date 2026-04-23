import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Wallet, TrendingUp, Bell } from "lucide-react";
import { claims, subscriptions, claimsMonthly, claimsByStatus, notifications } from "@/data/mock";
import { formatXOF, formatDate } from "@/lib/format";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";

export default function AdminDashboard() {
  const totalIndemnise = claims.reduce((s, c) => s + (c.montantIndemnise ?? 0), 0);
  const enAttente = subscriptions.filter((s) => s.statut === "En attente").length;
  const sinistresOuverts = claims.filter((c) => !["Accepté", "Refusé", "Payé"].includes(c.statut)).length;

  return (
    <AppLayout
      space="admin"
      title="Vue d'ensemble"
      subtitle="Performance globale de la plateforme SafeDelay"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard label="Souscriptions en attente" value={enAttente} icon={Users} accent="warning" />
        <DashboardCard label="Sinistres ouverts" value={sinistresOuverts} icon={AlertTriangle} accent="info" trend={{ value: "5%", positive: true }} />
        <DashboardCard label="Total indemnisé" value={formatXOF(totalIndemnise)} icon={Wallet} accent="success" />
        <DashboardCard label="Taux d'acceptation" value="78%" icon={TrendingUp} accent="primary" trend={{ value: "3%", positive: true }} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Évolution mensuelle</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={claimsMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mois" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="soumis" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="payes" stroke="hsl(var(--success))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Sinistres par statut</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="statut" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="valeur" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Dossiers récents</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/admin/sinistres">Tout voir →</Link></Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3">Référence</th>
                  <th className="text-left px-6 py-3">Fournisseur</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-right px-6 py-3">Montant</th>
                  <th className="text-left px-6 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {claims.slice(0, 6).map((c) => (
                  <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium"><Link to={`/admin/sinistres/${c.id}`} className="text-primary hover:underline">{c.reference}</Link></td>
                    <td className="px-6 py-3">{c.fournisseur}</td>
                    <td className="px-6 py-3 text-muted-foreground">{formatDate(c.dateDeclaration)}</td>
                    <td className="px-6 py-3 text-right">{formatXOF(c.montantReclame)}</td>
                    <td className="px-6 py-3"><StatusBadge status={c.statut} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/admin/notifications">Tout</Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} className="flex gap-3 text-sm">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.lue ? "bg-muted-foreground/40" : "bg-primary"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{n.titre}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}