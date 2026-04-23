import { cn } from "@/lib/utils";
import type { ClaimStatus, ContractStatus, SubscriptionStatus } from "@/types";

type AnyStatus = ClaimStatus | SubscriptionStatus | ContractStatus | string;

const STYLES: Record<string, string> = {
  // Claims
  Soumis: "bg-muted text-muted-foreground border-border",
  "En cours de vérification": "bg-info/10 text-info border-info/20",
  "En analyse": "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
  "Documents manquants": "bg-yellow-500/10 text-yellow-700 border-yellow-500/30 dark:text-yellow-400",
  Accepté: "bg-emerald-400/15 text-emerald-700 border-emerald-400/30 dark:text-emerald-400",
  Refusé: "bg-destructive/10 text-destructive border-destructive/20",
  Payé: "bg-emerald-700/15 text-emerald-800 border-emerald-700/30 dark:text-emerald-300",
  // Subscription
  "En attente": "bg-warning/10 text-warning border-warning/20",
  Validée: "bg-success/10 text-success border-success/20",
  Refusée: "bg-destructive/10 text-destructive border-destructive/20",
  // Contract
  Actif: "bg-success/10 text-success border-success/20",
  Expiré: "bg-muted text-muted-foreground border-border",
  Suspendu: "bg-warning/10 text-warning border-warning/20",
};

export function StatusBadge({ status, className }: { status: AnyStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        STYLES[status] ?? "bg-muted text-muted-foreground border-border",
        className
      )}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}