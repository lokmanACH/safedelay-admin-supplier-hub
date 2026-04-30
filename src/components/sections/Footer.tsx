
export default function Footer() {
  return (
    <footer className="w-full border-t border-[hsl(var(--border))] bg-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "var(--gradient-primary)" }}
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-[hsl(var(--background))]">SafeDelay</span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
          © {new Date().getFullYear()} SafeDelay
        </p>

      </div>
    </footer>
  );
}