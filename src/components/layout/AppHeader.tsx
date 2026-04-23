import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; to?: string }[];
}

export function AppHeader({ title, subtitle, breadcrumbs }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 md:px-8">
        <div className="flex-1 min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="text-xs text-muted-foreground">
              {breadcrumbs.map((b, i) => (
                <span key={i}>
                  {b.to ? (
                    <Link to={b.to} className="hover:text-foreground">{b.label}</Link>
                  ) : (
                    <span>{b.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <span className="mx-1.5">/</span>}
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground hidden md:block">{subtitle}</p>}
        </div>

        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-9 w-64 bg-muted/40 border-border" />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
            SL
          </div>
          <div className="hidden md:block text-xs">
            <p className="font-medium text-foreground">Sahel Logistique</p>
            <p className="text-muted-foreground">contact@sahel-logistique.sn</p>
          </div>
        </div>
      </div>
    </header>
  );
}