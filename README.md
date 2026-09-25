# Cyber-Threat-Monitor

Evidence-first security monitoring and detection engineering platform built with React, Vite, FastAPI, Python, and SQLite.

> **Current milestone: v0.8.0 — Persistent Detection, Real Telemetry Ingestion & Analyst Workflow**

Cyber-Threat-Monitor is designed around a defensible security evidence chain rather than a dashboard full of simulated SOC metrics.

## Architecture

```text
Windows / Wazuh Telemetry
          |
          v
Wazuh Normalization
          |
          v
FastAPI Ingestion
          |
          v
SQLite Persistence
          |
          v
Detection Engine
          |
          +---- DET-001 PowerShell
          |
          +---- DET-002 Encoded PowerShell
          |
          v
Security Alert
          |
          v
Host-based Incident Correlation
          |
          v
Analyst Investigation
          |
          +---- status lifecycle
          +---- evidence view
          +---- analyst notes
```

The evidence chain is:

```text
Source Event
   ->
Stored Event ID
   ->
Detection Rule ID
   ->
Alert ID
   ->
Incident ID
   ->
Analyst Action
```

## Implemented in v0.8

### Persistent storage

SQLite now stores:

* security events
* detection alerts
* incidents
* alert-to-incident relationships
* analyst actions

The database survives API restarts.

Set `CTM_DB_PATH` to control the database location. The default is `backend/data/cyber_threat_monitor.db`.

### Detection

Current rules:

| Rule | Description | MITRE ATT&CK |
| --- | --- | --- |
| DET-001 | PowerShell process execution | T1059.001 |
| DET-002 | Encoded PowerShell command | T1059.001, T1027 |

### Wazuh ingestion

`POST /api/ingest/wazuh` accepts Wazuh alert JSON and normalizes Windows process-creation events into the platform's `SecurityEvent` model.

The included `backend/app/integrations/wazuh_forwarder.py` can follow Wazuh's `alerts.json` file and forward new alerts to the CTM API.

Default Wazuh alert path:

```text
/var/ossec/logs/alerts/alerts.json
```

This should be verified against the actual Wazuh manager configuration before deployment.

### Analyst workflow

Alerts support:

* open
* acknowledged
* resolved

Incidents support:

* open
* investigating
* contained
* resolved
* closed

Analysts can record durable investigation notes against alerts and incidents.

Evidence endpoints expose the relationship between:

```text
Incident -> Alerts -> Source Events -> Analyst Actions
```

### Dashboard

Dashboard metrics are calculated from persisted backend state. The frontend no longer generates synthetic security events or fake alert counts.

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | API health |
| `GET /api/metrics` | Persisted SOC metrics |
| `POST /api/events` | Ingest normalized security event |
| `GET /api/events` | Retrieve stored events |
| `GET /api/events/alerts` | Retrieve generated alerts |
| `POST /api/ingest/wazuh` | Ingest a Wazuh alert |
| `GET /api/alerts` | List/filter alerts |
| `GET /api/alerts/{id}` | Retrieve an alert |
| `PATCH /api/alerts/{id}` | Update alert status |
| `GET /api/alerts/{id}/evidence` | Alert evidence chain |
| `POST /api/alerts/{id}/actions` | Record analyst action |
| `GET /api/incidents` | List incidents |
| `GET /api/incidents/{id}` | Retrieve incident |
| `PATCH /api/incidents/{id}` | Update incident status |
| `GET /api/incidents/{id}/evidence` | Incident evidence |
| `POST /api/incidents/{id}/actions` | Record analyst action |
| `GET /api/rules` | List detection rules |
| `GET /api/rules/{id}` | Retrieve a detection rule |

## Testing

Backend tests cover:

* detection rule behavior
* event API ingestion
* SQLite persistence across module/database reload
* durable analyst actions
* alert and incident lifecycle state
* Wazuh Windows process-event normalization

Run:

```bash
python -m pytest backend/tests -v
```

Frontend:

```bash
npm run lint
npm run build
```

## Running locally

### Backend

From the repository root:

```bash
python -m pip install -r backend/requirements.txt
uvicorn app.main:app --app-dir backend --reload
```

API:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Wazuh forwarding

On the Wazuh manager, configure the environment for the forwarder:

```text
WAZUH_ALERTS_FILE=/var/ossec/logs/alerts/alerts.json
CTM_API_URL=http://<ctm-host>:8000/api/ingest/wazuh
WAZUH_INGEST_API_KEY=<same-key-used-by-ctm>
```

Then run:

```bash
python backend/app/integrations/wazuh_forwarder.py
```

For a local WSL lab, the network route between the Wazuh manager and the Windows-hosted FastAPI process must be verified. Do not assume `127.0.0.1` on WSL points to the Windows host.

## Validation sequence

A real validation should demonstrate:

1. Windows endpoint generates telemetry.
2. Wazuh receives the telemetry.
3. Wazuh alert reaches `/api/ingest/wazuh`.
4. CTM stores the normalized event in SQLite.
5. Detection engine creates an alert.
6. Alert is correlated into an incident.
7. Dashboard reads persisted state.
8. Analyst acknowledges/investigates the alert.
9. Analyst records an evidence note.
10. API restart does not erase the investigation.

## Scope and limitations

This is a defensive security engineering project for authorized laboratory environments.

It is not presented as a production SIEM/XDR platform. Production deployment would require additional controls such as authenticated users, stronger secret management, database migrations, concurrency hardening, queue-based ingestion, retention policies, audit integrity controls, TLS, observability, and deployment security.

The Wazuh adapter is implemented, but end-to-end real-telemetry validation depends on the user's live Wazuh/Windows environment and must be demonstrated there.

## Engineering approach

1. Study existing systems.
2. Identify a concrete gap.
3. Build the smallest useful implementation.
4. Test it.
5. Capture evidence.
6. Document limitations.
7. Expand only when evidence justifies it.

No synthetic telemetry is presented as live security data.
