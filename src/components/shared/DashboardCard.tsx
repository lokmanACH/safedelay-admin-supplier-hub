import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  accent?: "primary" | "success" | "warning" | "info";
}

const ACCENTS: Record<NonNullable<Props["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

export function DashboardCard({ label, value, hint, icon: Icon, trend, accent = "primary" }: Props) {
  return (
    <Card className="border-border/60 shadow-soft hover:shadow-card transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div className={cn("rounded-lg p-2.5", ACCENTS[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            <span className={cn("font-medium", trend.positive ? "text-success" : "text-destructive")}>
              {trend.positive ? "▲" : "▼"} {trend.value}
            </span>
            <span className="text-muted-foreground">vs mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}