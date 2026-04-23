import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: Props) {
  return (
    <ol className="flex flex-wrap items-center gap-2 md:gap-0">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center md:flex-1">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  done && "border-success bg-success text-success-foreground",
                  active && "border-primary bg-primary text-primary-foreground",
                  !done && !active && "border-border bg-background text-muted-foreground"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden md:inline",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-3 hidden h-px flex-1 md:block",
                  done ? "bg-success" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}