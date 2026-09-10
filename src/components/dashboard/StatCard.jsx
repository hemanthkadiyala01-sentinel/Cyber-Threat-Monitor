export default function StatCard({ label, value, trend, color }) {
  return (
    <article className="glass-panel rounded-2xl p-4 shadow-[0_0_24px_rgba(0,213,255,0.08)]">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
      <p className={`mt-2 text-xs ${color}`}>{trend}</p>
    </article>
  );
}
