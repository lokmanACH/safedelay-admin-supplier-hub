import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { notifications } from "@/data/mock";
import { formatDateTime } from "@/lib/format";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

const ICONS = {
  success: { icon: CheckCircle2, color: "text-success bg-success/10" },
  warning: { icon: AlertTriangle, color: "text-warning bg-warning/10" },
  info: { icon: Info, color: "text-info bg-info/10" },
  error: { icon: XCircle, color: "text-destructive bg-destructive/10" },
} as const;

export default function Notifications() {
  return (
    <AppLayout
      space="admin"
      title="Centre de notifications"
      subtitle="Toutes les actions et alertes récentes"
      breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Notifications" }]}
    >
      <Card className="shadow-soft">
        <CardContent className="p-0">
          <ul>
            {notifications.map((n) => {
              const cfg = ICONS[n.type];
              const Icon = cfg.icon;
              return (
                <li key={n.id} className="flex items-start gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-muted/30">
                  <div className={`rounded-lg p-2 ${cfg.color}`}><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{n.titre}</p>
                      {!n.lue && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDateTime(n.date)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </AppLayout>
  );
}