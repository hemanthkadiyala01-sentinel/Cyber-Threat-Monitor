import { Shield } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ items, open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/50 transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`glass-panel fixed inset-y-0 left-0 z-40 w-72 transform border-r border-cyan-400/20 p-4 transition-transform duration-300 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="neon-ring rounded-xl bg-slate-950/70 p-4">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-cyan-500/20 p-2">
              <Shield className="h-5 w-5 text-cyan-300" />
            </span>
            <div>
              <p className="text-sm font-semibold">CyberSentinel</p>
              <p className="text-xs text-slate-400">SIEM Platform</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.id}
              onClick={() => {
                onClose();
              }}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${isActive ? "bg-cyan-500/20 text-cyan-200" : "text-slate-300 hover:bg-slate-800/80 hover:text-cyan-100"}`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
