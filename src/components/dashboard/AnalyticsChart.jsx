export default function AnalyticsChart({ data }) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);

  return (
    <section className="glass-panel rounded-2xl p-5">
      <h2 className="text-lg font-medium text-cyan-200">Threat Volume Analytics</h2>
      <p className="mt-1 text-sm text-slate-400">Hourly incident trend across monitored assets</p>

      <div className="mt-6 flex h-64 items-end gap-3 rounded-xl border border-cyan-400/10 bg-slate-950/40 p-4">
        {data.map((point) => {
          const height = `${(point.value / maxValue) * 100}%`;
          return (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-cyan-500/70 to-violet-500/80 shadow-[0_0_12px_rgba(0,213,255,0.25)]"
                  style={{ height }}
                />
              </div>
              <span className="text-[10px] text-slate-400">{point.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
