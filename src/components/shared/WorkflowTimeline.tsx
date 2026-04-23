import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import type { ClaimTimelineEvent } from "@/types";

export function WorkflowTimeline({ events }: { events: ClaimTimelineEvent[] }) {
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {events.map((e, i) => (
        <li key={i} className="relative">
          <span className={cn(
            "absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background",
            i === events.length - 1 ? "bg-primary" : "bg-success"
          )} />
          <p className="text-sm font-semibold text-foreground">{e.titre}</p>
          <p className="text-xs text-muted-foreground">{formatDateTime(e.date)} · {e.auteur}</p>
          <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
        </li>
      ))}
    </ol>
  );
}