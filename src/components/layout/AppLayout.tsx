import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface Props {
  space: "fournisseur" | "admin";
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}

export function AppLayout({ space, title, subtitle, breadcrumbs, actions, children }: Props) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <AppSidebar space={space} />
      
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AppHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
        
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
          {actions && <div className="mb-6 flex flex-wrap gap-2 justify-end">{actions}</div>}
          {children}
        </main>
      </div>
    </div>
  );
}