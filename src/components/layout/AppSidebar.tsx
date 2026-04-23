import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileSignature, AlertTriangle, FileText, Files, User,
  ListChecks, Settings2, BarChart3, Bell, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FOURNISSEUR_NAV = [
  { to: "/fournisseur/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/fournisseur/souscription", label: "Souscription", icon: FileSignature },
  { to: "/fournisseur/sinistres", label: "Sinistres", icon: AlertTriangle },
  { to: "/fournisseur/contrats", label: "Contrats", icon: FileText },
  { to: "/fournisseur/documents", label: "Documents", icon: Files },
  { to: "/fournisseur/profil", label: "Profil", icon: User },
];

const ADMIN_NAV = [
  { to: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/souscriptions", label: "Souscriptions", icon: ListChecks },
  { to: "/admin/sinistres", label: "Sinistres", icon: AlertTriangle },
  { to: "/admin/regles-tarifaires", label: "Règles tarifaires", icon: Settings2 },
  { to: "/admin/rapports", label: "Rapports", icon: BarChart3 },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
];

export function AppSidebar({ space }: { space: "fournisseur" | "admin" }) {
  const items = space === "fournisseur" ? FOURNISSEUR_NAV : ADMIN_NAV;
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
          <ShieldCheck className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">SafeDelay</p>
          <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground">
            {space === "fournisseur" ? "Espace fournisseur" : "Console admin"}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <NavLink
          to={space === "fournisseur" ? "/admin/dashboard" : "/fournisseur/dashboard"}
          className="block rounded-lg bg-sidebar-accent/40 px-3 py-2 text-xs text-sidebar-foreground hover:text-white"
        >
          Basculer vers {space === "fournisseur" ? "Admin" : "Fournisseur"} →
        </NavLink>
      </div>
    </aside>
  );
}