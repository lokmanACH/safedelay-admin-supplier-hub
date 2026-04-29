import { Label } from "@/components/ui/label";

/**
 * Wrapper component for form fields with label and consistent spacing
 */
export function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

/**
 * Error message display component for form field validation errors
 */
export function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive mt-1">{msg}</p>;
}
