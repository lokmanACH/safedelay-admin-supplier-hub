import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { claims, claimsMonthly, claimsByStatus, topSuppliers } from "@/data/mock";
import { formatXOF } from "@/lib/format";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";
import { Wallet, FileCheck, AlertCircle, Building2 } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "hsl(var(--info))", "hsl(var(--warning))", "hsl(var(--success))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"];

export default function Rapports() {
  const totalIndemnise = claims.reduce((s, c) => s + (c.montantIndemnise ?? 0), 0);
  const totalReclame = claims.reduce((s, c) => s + c.montantReclame, 0);

  return (
    <AppLayout
      space="admin"
      title="Rapports"
      subtitle="Analyse de la performance et des indemnisations"
      breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Rapports" }]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard label="Total réclamé" value={formatXOF(totalReclame)} icon={AlertCircle} accent="warning" />
        <DashboardCard label="Total indemnisé" value={formatXOF(totalIndemnise)} icon={Wallet} accent="success" />
        <DashboardCard label="Dossiers traités" value={claims.length} icon={FileCheck} accent="primary" />
        <DashboardCard label="Fournisseurs actifs" value={4} icon={Building2} accent="info" />
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Sinistres par statut</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={claimsByStatus} dataKey="valeur" nameKey="statut" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {claimsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Évolution mensuelle</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={claimsMonthly}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mois" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="soumis" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#rg)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader><CardTitle className="text-base">Top fournisseurs (par sinistres)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSuppliers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="nom" stroke="hsl(var(--muted-foreground))" fontSize={12} width={140} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="sinistres" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}