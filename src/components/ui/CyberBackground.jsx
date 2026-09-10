export default function CyberBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 cyber-grid">
      <div className="absolute left-[-10%] top-[12%] h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
      <div className="absolute right-[-10%] top-[38%] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[35%] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_92%,rgba(0,213,255,0.1)_100%)] bg-[length:100%_6px] opacity-25" />
    </div>
  );
}
