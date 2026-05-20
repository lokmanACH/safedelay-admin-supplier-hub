import logo_pic from "/assets/logo_pic.png";
import logo_name from "/assets/logo_name.png";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[hsl(var(--border))] bg-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <img src={logo_pic} alt="SafeDelay" className="h-7 w-7" />
          <img src={logo_name} alt="SafeDelay" className="h-6 w-auto" />
        </div>

        {/* Copyright */}
        <p className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
          © {new Date().getFullYear()} SafeDelay - Tous droits réservés
        </p>

      </div>
    </footer>
  );
}