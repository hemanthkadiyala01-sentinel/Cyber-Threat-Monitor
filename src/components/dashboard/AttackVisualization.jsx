const nodes = [
  { id: "internet", label: "Internet", x: "8%", y: "45%" },
  { id: "waf", label: "WAF", x: "36%", y: "28%" },
  { id: "soc", label: "SOC Core", x: "64%", y: "45%" },
  { id: "db", label: "Data Lake", x: "88%", y: "30%" },
  { id: "edr", label: "EDR", x: "84%", y: "68%" }
];

const links = [
  { from: nodes[0], to: nodes[1], status: "blocked" },
  { from: nodes[1], to: nodes[2], status: "investigating" },
  { from: nodes[2], to: nodes[3], status: "normal" },
  { from: nodes[2], to: nodes[4], status: "normal" }
];

const statusClass = {
  blocked: "bg-red-400",
  investigating: "bg-yellow-300",
  normal: "bg-cyan-300"
};

export default function AttackVisualization() {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <h2 className="text-lg font-medium text-cyan-200">Attack Visualization</h2>
      <p className="mt-1 text-sm text-slate-400">Realtime network flow across defensive layers</p>
      <div className="relative mt-4 h-64 overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-950/50">
        {links.map((link, index) => (
          <div
            key={`${link.from.id}-${link.to.id}`}
            className={`absolute h-0.5 origin-left ${statusClass[link.status]} opacity-75`}
            style={{
              left: link.from.x,
              top: link.from.y,
              width: `${Math.hypot(parseFloat(link.to.x) - parseFloat(link.from.x), parseFloat(link.to.y) - parseFloat(link.from.y))}%`,
              transform: `rotate(${Math.atan2(parseFloat(link.to.y) - parseFloat(link.from.y), parseFloat(link.to.x) - parseFloat(link.from.x))}rad)`,
              animation: `pulse 1.8s ${index * 0.2}s infinite`
            }}
          />
        ))}

        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-cyan-400/30 bg-slate-900/80 px-2 py-1 text-xs text-cyan-100"
            style={{ left: node.x, top: node.y }}
          >
            {node.label}
          </div>
        ))}
      </div>
    </section>
  );
}
