import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import AlertPanel from "../components/dashboard/AlertPanel";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import { stats, threatAlerts, trendData } from "../data/mockData";
import AttackVisualization from "../components/dashboard/AttackVisualization";

const liveTitles = [
  "Suspicious outbound traffic spike",
  "Brute force anomaly detected",
  "Credential abuse signature matched",
  "Privilege escalation attempt observed"
];

export default function DashboardPage() {
  const [liveAlerts, setLiveAlerts] = useState(threatAlerts);

  useEffect(() => {
    const timer = setInterval(() => {
      const title = liveTitles[Math.floor(Math.random() * liveTitles.length)];
      const id = `live-${Date.now()}`;
      const severity = ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)];
      const alert = {
        id,
        title,
        source: `${Math.floor(Math.random() * 200) + 20}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        target: "soc-core-edge",
        severity,
        time: "just now"
      };
      setLiveAlerts((prev) => [alert, ...prev.slice(0, 11)]);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const criticalCount = useMemo(
    () => liveAlerts.filter((item) => item.severity === "critical").length,
    [liveAlerts]
  );

  return (
    <div>
      <header className="mb-6 rounded-2xl border border-cyan-400/25 bg-slate-900/50 p-5 shadow-[0_0_40px_rgba(0,213,255,0.12)] backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Security Operations Center</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">CyberSentinel SIEM Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Monitor realtime threats, analyze attack trends, and orchestrate SOC response from one control surface.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AnalyticsChart data={trendData} />
        </div>
        <AlertPanel alerts={liveAlerts} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="glass-panel rounded-2xl p-5">
          <h2 className="text-lg font-medium text-cyan-200">Threat Intelligence Overview</h2>
          <p className="mt-2 text-sm text-slate-300">
            24-hour ingestion from IDS, endpoint telemetry, firewall logs, and cloud workload sensors.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-cyan-400/20 bg-slate-950/50 p-3">
              <p className="text-slate-400">Critical alerts</p>
              <p className="mt-1 text-xl font-semibold text-red-300">{criticalCount}</p>
            </div>
            <div className="rounded-xl border border-cyan-400/20 bg-slate-950/50 p-3">
              <p className="text-slate-400">MTTR</p>
              <p className="mt-1 text-xl font-semibold text-cyan-300">21m</p>
            </div>
          </div>
        </section>

        <AttackVisualization />

        <section className="glass-panel rounded-2xl p-5">
          <h2 className="text-lg font-medium text-cyan-200">Threat Intelligence Panel</h2>
          <p className="mt-2 text-sm text-slate-300">
            Correlated feeds from MITRE ATT&CK mappings, CVE activity, and known malicious indicators.
          </p>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <div className="rounded-xl border border-cyan-400/20 bg-slate-950/50 p-3">Top IOC: 91.102.44.12 (Credential abuse campaign)</div>
            <div className="rounded-xl border border-cyan-400/20 bg-slate-950/50 p-3">Active CVE: CVE-2026-1103 (CVSS 9.8)</div>
            <div className="rounded-xl border border-cyan-400/20 bg-slate-950/50 p-3">Threat actor cluster: FIN-27 activity pattern matched</div>
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-5 md:col-span-2">
          <h2 className="text-lg font-medium text-cyan-200">Realtime Activity Feed</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {liveAlerts.slice(0, 4).map((alert) => (
              <li key={alert.id} className="rounded-xl border border-cyan-400/20 bg-slate-950/50 p-3">
                <p className="font-medium text-slate-100">{alert.title}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {alert.source} {"->"} {alert.target} | {alert.time}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
