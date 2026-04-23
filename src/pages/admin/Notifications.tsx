import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notifications as initial } from "@/data/mock";
import { formatDateTime } from "@/lib/format";
import { CheckCircle2, AlertTriangle, Info, XCircle, Filter, CheckCheck } from "lucide-react";
import type { Notification } from "@/types";

const ICONS = {
  success: { icon: CheckCircle2, color: "text-success bg-success/10" },
  warning: { icon: AlertTriangle, color: "text-warning bg-warning/10" },
  info: { icon: Info, color: "text-info bg-info/10" },
  error: { icon: XCircle, color: "text-destructive bg-destructive/10" },
} as const;

const CATEGORIES = ["souscription", "sinistre", "paiement", "contrat", "système"] as const;

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>(initial);
  const [cat, setCat] = useState<string>("all");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visible = useMemo(() => items.filter((n) =>
    (cat === "all" || n.category === cat) &&
    (filter === "all" || !n.lue)
  ), [items, cat, filter]);

  const unread = items.filter((n) => !n.lue).length;

  const markAllRead = () => setItems((curr) => curr.map((n) => ({ ...n, lue: true })));
  const markRead = (id: string) => setItems((curr) => curr.map((n) => n.id === id ? { ...n, lue: true } : n));

  return (
    <AppLayout
      space="admin"
      title="Centre de notifications"
      subtitle={`${unread} non lue(s) · événements liés aux souscriptions, sinistres, paiements et contrats`}
      breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Notifications" }]}
      actions={
        <Button variant="outline" size="sm" onClick={markAllRead} disabled={unread === 0}>
          <CheckCheck className="h-4 w-4 mr-2" />Tout marquer comme lu
        </Button>
      }
    >
      <Card className="shadow-soft">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-full md:w-56"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>Toutes</Button>
            <Button size="sm" variant={filter === "unread" ? "default" : "outline"} onClick={() => setFilter("unread")}>Non lues</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 shadow-soft">
        <CardContent className="p-0">
          {visible.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">Aucune notification</p>
          ) : (
            <ul>
              {visible.map((n) => {
                const cfg = ICONS[n.type];
                const Icon = cfg.icon;
                const Wrapper: React.ElementType = n.link ? Link : "div";
                return (
                  <li key={n.id} className={`border-b border-border last:border-0 ${!n.lue ? "bg-primary/5" : ""}`}>
                    <Wrapper {...(n.link ? { to: n.link } : {})} onClick={() => markRead(n.id)} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/30 cursor-pointer">
                      <div className={`rounded-lg p-2 ${cfg.color}`}><Icon className="h-4 w-4" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold">{n.titre}</p>
                          {n.category && <span className="text-[10px] uppercase tracking-wide rounded-full border border-border bg-muted px-2 py-0.5 text-muted-foreground">{n.category}</span>}
                          {!n.lue && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDateTime(n.date)}</p>
                      </div>
                    </Wrapper>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}