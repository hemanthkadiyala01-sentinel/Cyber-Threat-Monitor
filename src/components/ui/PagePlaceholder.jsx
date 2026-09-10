export default function PagePlaceholder({ title, description, highlights }) {
  const handleAction = (actionName) => {
    window.alert(`${actionName} clicked`);
  };

  return (
    <div>
      <header className="mb-6 rounded-2xl border border-cyan-400/25 bg-slate-900/50 p-5 shadow-[0_0_40px_rgba(0,213,255,0.12)] backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">SOC Module</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">{description}</p>
      </header>

      <section className="glass-panel rounded-2xl p-5">
        <h2 className="text-lg font-medium text-cyan-200">Available Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <button
              key={item}
              onClick={() => handleAction(item)}
              className="rounded-xl border border-cyan-400/20 bg-slate-950/60 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/40 hover:bg-slate-900"
            >
              {item}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
