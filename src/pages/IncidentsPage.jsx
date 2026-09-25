import { useEffect, useState } from "react";
import { RefreshCw, ShieldAlert } from "lucide-react";
import {
  addIncidentAction,
  getIncidentEvidence,
  getIncidents,
  updateIncidentStatus,
} from "../services/api";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function loadIncidents() {
    try {
      setIncidents(await getIncidents());
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function selectIncident(incident) {
    setSelected(incident);
    try {
      setEvidence(await getIncidentEvidence(incident.incident_id));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadIncidents();
    });
  }, []);

  async function changeStatus(status) {
    if (!selected) return;
    try {
      const updated = await updateIncidentStatus(selected.incident_id, status);
      setSelected(updated);
      await loadIncidents();
      await selectIncident(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  async function addNote() {
    if (!selected || !note.trim()) return;
    try {
      await addIncidentAction(selected.incident_id, {
        action: "analyst_note",
        analyst: "analyst",
        note: note.trim(),
      });
      setNote("");
      await selectIncident(selected);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <header className="mb-6 rounded-2xl border border-cyan-400/25 bg-slate-900/50 p-5 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">SOC Module</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Incident Response</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Correlated alerts become durable incidents with a traceable investigation timeline.
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
            <h2 className="text-lg font-medium text-cyan-200">Incident Queue</h2>
            <button onClick={loadIncidents} className="rounded-lg border border-cyan-400/20 p-2 text-cyan-200">
              <RefreshCw size={16} />
            </button>
          </div>

          {incidents.length === 0 ? (
            <p className="text-sm text-slate-400">No incidents stored yet.</p>
          ) : (
            <div className="space-y-2">
              {incidents.map((incident) => (
                <button
                  key={incident.incident_id}
                  onClick={() => selectIncident(incident)}
                  className={`w-full rounded-xl border p-3 text-left ${
                    selected?.incident_id === incident.incident_id
                      ? "border-cyan-300/50 bg-cyan-400/10"
                      : "border-slate-700 bg-slate-950/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{incident.incident_id}</span>
                    <span className="text-xs uppercase text-cyan-300">{incident.severity}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{incident.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {incident.host || "unknown host"} · {incident.alert_ids.length} alert(s) · {incident.status}
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
                <ShieldAlert className="mx-auto mb-3" />
                Select an incident to inspect its evidence and lifecycle.
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-cyan-300">{selected.incident_id}</p>
                  <h2 className="mt-1 text-xl font-semibold">{selected.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{selected.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["investigating", "contained", "resolved"].map((status) => (
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
                <Evidence label="Alerts" value={String(selected.alert_ids.length)} />
                <Evidence label="MITRE" value={selected.mitre_attack.join(", ") || "none"} />
              </div>

              <div className="mt-5 rounded-xl border border-cyan-400/15 bg-slate-950/60 p-4">
                <h3 className="text-sm font-medium text-cyan-200">Evidence Chain</h3>
                <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap text-xs text-slate-300">
                  {JSON.stringify(
                    {
                      alerts: evidence?.alerts || [],
                      events: evidence?.events || [],
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              <div className="mt-5 rounded-xl border border-cyan-400/15 bg-slate-950/60 p-4">
                <h3 className="text-sm font-medium text-cyan-200">Investigation Notes</h3>
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
                  <button onClick={addNote} className="rounded-lg bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                    Add
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



