const severityClasses = {
  critical: "border-red-500/40 bg-red-500/10 text-red-200",
  high: "border-orange-400/40 bg-orange-400/10 text-orange-200",
  medium: "border-yellow-400/40 bg-yellow-400/10 text-yellow-200",
  low: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
};

export default function AlertPanel({ alerts }) {
  return (
    <aside className="glass-panel rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-medium text-cyan-200">Realtime Threat Alerts</h2>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-200">
          LIVE
        </span>
      </div>
      <div className="space-y-3">
        {alerts.slice(0, 6).map((alert) => (
          <div key={alert.id} className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{alert.title}</p>
              <span className={`rounded-md border px-2 py-0.5 text-[10px] uppercase ${severityClasses[alert.severity]}`}>
                {alert.severity}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{alert.source} {"->"} {alert.target}</p>
            <p className="mt-1 text-[11px] text-slate-500">{alert.time}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
