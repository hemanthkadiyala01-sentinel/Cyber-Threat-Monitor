import { Bell, LogOut, Menu, Moon, Search, Sun } from "lucide-react";

export default function TopNavbar({
  onOpenSidebar,
  onOpenAlerts,
  onOpenThreatIntel,
  onOpenSettings,
  onToggleTheme,
  theme,
  onLogout,
  userEmail
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-cyan-400/10 bg-slate-950/70 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSidebar}
            className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-200 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
          <p className="hidden text-sm text-slate-400 sm:block">SOC Command Interface</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenThreatIntel}
            className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-100 sm:flex"
          >
            <Search className="h-4 w-4" />
            Search indicators, hosts, CVEs
          </button>
          <button
            onClick={onOpenAlerts}
            className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-200 transition hover:bg-cyan-400/20"
            aria-label="Open alerts"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleTheme}
            className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-200 transition hover:bg-cyan-400/20"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={onOpenSettings}
            className="rounded-lg border border-cyan-400/20 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-100"
          >
            {userEmail}
          </button>
          <button
            onClick={onLogout}
            className="rounded-lg border border-red-400/30 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/20"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
