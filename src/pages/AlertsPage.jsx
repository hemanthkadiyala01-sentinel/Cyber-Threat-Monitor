import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import {
  addAlertAction,
  getAlertEvidence,
  getAlerts,
  updateAlertStatus,
} from "../services/api";

const severityClasses = {
  critical: "border-red-400/40 bg-red-500/10 text-red-200",
  high: "border-orange-400/40 bg-orange-500/10 text-orange-200",
  medium: "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  low: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  info: "border-slate-500/40 bg-slate-500/10 text-slate-200",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAlerts() {
    try {
      setLoading(true);
      setAlerts(await getAlerts());
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function selectAlert(alert) {
    setSelected(alert);
    try {
      setEvidence(await getAlertEvidence(alert.alert_id));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadAlerts();
    });
  }, []);

  async function changeStatus(status) {
    if (!selected) return;
    try {
      const updated = await updateAlertStatus(selected.alert_id, status);
      setSelected(updated);
      await loadAlerts();
      await selectAlert(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  async function addNote() {
    if (!selected || !note.trim()) return;
    try {
      await addAlertAction(selected.alert_id, {
        action: "analyst_note",
        analyst: "analyst",
        note: note.trim(),
      });
      setNote("");
      await selectAlert(selected);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <header className="mb-6 rounded-2xl border border-cyan-400/25 bg-slate-900/50 p-5 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">SOC Module</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Threat Alerts</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Investigate persisted detections and trace each alert back to its source event.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-950/20 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="glass-panel rounded-2xl p-4 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-cyan-200">Alert Queue</h2>
            <button onClick={loadAlerts} className="rounded-lg border border-cyan-400/20 p-2 text-cyan-200">
              <RefreshCw size={16} />
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400">Loading persisted alerts...</p>
          ) : alerts.length === 0 ? (
            <p className="text-sm text-slate-400">No alerts stored yet.</p>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <button
                  key={alert.alert_id}
                  onClick={() => selectAlert(alert)}
                  className={`w-full rounded-xl border p-3 text-left ${
                    selected?.alert_id === alert.alert_id
                      ? "border-cyan-300/50 bg-cyan-400/10"
                      : "border-slate-700 bg-slate-950/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-100">{alert.title}</span>
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] uppercase ${severityClasses[alert.severity] || severityClasses.info}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {alert.alert_id} · {alert.host || "unknown host"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(alert.created_at).toLocaleString()} · {alert.status}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="glass-panel rounded-2xl p-5 xl:col-span-3">
          {!selected ? (
            <div className="flex min-h-64 items-center justify-center text-center text-sm text-slate-500">
              <div>
                <AlertTriangle className="mx-auto mb-3" />
                Select an alert to inspect its evidence chain.
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-cyan-300">{selected.rule_id}</p>
                  <h2 className="mt-1 text-xl font-semibold">{selected.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{selected.description}</p>
                </div>
                <div className="flex gap-2">
                  {["acknowledged", "resolved"].map((status) => (
                    <button
                      key={status}
                      onClick={() => changeStatus(status)}
                      className="rounded-lg border border-cyan-400/20 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-400/10"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                <Evidence label="Status" value={selected.status} />
                <Evidence label="Host" value={selected.host || "unknown"} />
                <Evidence label="Event ID" value={selected.event_id} />
                <Evidence label="MITRE" value={selected.mitre_attack.join(", ") || "none"} />
              </div>

              <div className="mt-5 rounded-xl border border-cyan-400/15 bg-slate-950/60 p-4">
                <h3 className="text-sm font-medium text-cyan-200">Source Event</h3>
                <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-slate-300">
                  {JSON.stringify(evidence?.event || {}, null, 2)}
                </pre>
              </div>

              <div className="mt-5 rounded-xl border border-cyan-400/15 bg-slate-950/60 p-4">
                <h3 className="text-sm font-medium text-cyan-200">Analyst Actions</h3>
                <div className="mt-3 space-y-2">
                  {(evidence?.analyst_actions || []).map((action) => (
                    <div key={action.action_id} className="rounded-lg bg-slate-900 p-3 text-xs">
                      <span className="text-cyan-200">{action.action}</span>
                      <span className="text-slate-500"> · {action.analyst}</span>
                      <p className="mt-1 text-slate-300">{action.note}</p>
                    </div>
                  ))}
                  {(!evidence?.analyst_actions || evidence.analyst_actions.length === 0) && (
                    <p className="text-xs text-slate-500">No analyst actions recorded.</p>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Record an investigation note..."
                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-400/50"
                  />
                  <button onClick={addNote} className="rounded-lg bg-cyan-400/10 px-3 py-2 text-cyan-200">
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Evidence({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 break-all text-sm text-slate-200">{value}</p>
    </div>
  );
}



