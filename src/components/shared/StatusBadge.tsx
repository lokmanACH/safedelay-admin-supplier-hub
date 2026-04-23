import { cn } from "@/lib/utils";
import type { ClaimStatus, ContractStatus, SubscriptionStatus } from "@/types";

type AnyStatus = ClaimStatus | SubscriptionStatus | ContractStatus | string;

const STYLES: Record<string, string> = {
  // Claims
  Soumis: "bg-info/10 text-info border-info/20",
  "En cours de vérification": "bg-info/10 text-info border-info/20",
  "En analyse": "bg-warning/10 text-warning border-warning/20",
  "Documents manquants": "bg-warning/10 text-warning border-warning/20",
  Accepté: "bg-success/10 text-success border-success/20",
  Refusé: "bg-destructive/10 text-destructive border-destructive/20",
  Payé: "bg-success/15 text-success border-success/30",
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