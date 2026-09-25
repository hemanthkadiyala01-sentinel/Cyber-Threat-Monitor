# Cyber-Threat-Monitor

Security monitoring and detection engineering platform built with React, Vite, FastAPI, and Python.

> **Current milestone: v0.5.0 — Security Monitoring & Detection Foundation**

Cyber-Threat-Monitor is being developed as a practical security engineering project focused on the path from security events to detections, alerts, incidents, and analyst investigation workflows.

The current release establishes the backend detection foundation. Real telemetry ingestion, persistent storage, and production-backed SOC dashboard metrics are planned for the next development phase.

## Current Architecture

```text
Security Event
      |
      v
FastAPI Event Ingestion
      |
      v
Detection Engine
      |
      +---- DET-001: PowerShell Process Execution
      |
      +---- DET-002: Encoded PowerShell Command
      |
      v
Security Alert
      |
      v
Host-based Alert Correlation
      |
      v
Security Incident
```

## Current Capabilities

### Backend

* FastAPI REST API
* Security event ingestion
* Security event retrieval
* Detection rule management
* Detection engine
* PowerShell process detection
* Encoded PowerShell command detection
* MITRE ATT&CK technique mapping
* Alert generation
* Alert filtering by severity and status
* Individual alert lookup
* Alert status updates
* Host-based alert correlation
* Incident generation and lookup
* API health endpoint

### Detection Rules

| Rule    | Description                  | MITRE ATT&CK     |
| ------- | ---------------------------- | ---------------- |
| DET-001 | PowerShell process execution | T1059.001        |
| DET-002 | Encoded PowerShell command   | T1059.001, T1027 |

## API Surface

| Endpoint                           | Purpose                       |
| ---------------------------------- | ----------------------------- |
| `GET /api/health`                  | API health check              |
| `POST /api/events`                 | Ingest a security event       |
| `GET /api/events`                  | Retrieve events               |
| `GET /api/events/alerts`           | Retrieve generated alerts     |
| `GET /api/alerts`                  | List/filter alerts            |
| `GET /api/alerts/{alert_id}`       | Retrieve an alert             |
| `PATCH /api/alerts/{alert_id}`     | Update alert status           |
| `GET /api/incidents`               | Generate correlated incidents |
| `GET /api/incidents/{incident_id}` | Retrieve an incident          |
| `GET /api/rules`                   | List detection rules          |
| `GET /api/rules/{rule_id}`         | Retrieve a detection rule     |

## Technology

### Backend

* Python
* FastAPI
* Pydantic
* Uvicorn

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Lucide React

## Current Data Model

The backend currently models:

* Security events
* Detection rules
* Security alerts
* Security incidents

The current implementation keeps event and alert state in application memory. Restarting the API therefore clears the current runtime state.

Persistent storage is intentionally deferred to the next milestone.

## Current Limitations

This release is a detection-engineering foundation, not a finished SIEM or XDR platform.

The following capabilities are not yet implemented:

* Persistent database storage
* Durable alert and incident state
* Real endpoint telemetry ingestion
* Wazuh ingestion
* Sysmon ingestion
* Elasticsearch/OpenSearch integration
* Production log pipelines
* Production threat-intelligence feeds
* Persistent analyst investigation history
* Full frontend/API operational integration
* Production-backed SOC metrics

The frontend also contains interface/demo components that are not authoritative security telemetry. They must not be interpreted as measurements from a live production SOC.

## Development Roadmap

### v0.5.0 — Security Monitoring & Detection Foundation

* Event ingestion
* Detection engine
* Detection rules
* Alert generation
* MITRE ATT&CK mapping
* Alert management
* Incident correlation

### v0.6.0 — Persistence & Testing

Planned:

* SQLite persistence
* Database models
* Repository/service separation
* Expanded backend and persistence tests
* Detection regression coverage
* Durable alert lifecycle
* Durable incident lifecycle

### v0.7.0 — Real Telemetry

Planned:

* One real telemetry source
* Event normalization
* Source metadata
* Real event-to-alert evidence chain

### v0.8.0 — Analyst Workflow

Planned:

* API-backed dashboard
* Alert investigation
* Incident investigation
* Status lifecycle
* Evidence views
* Detection transparency

### Future Direction

The long-term objective is to connect real telemetry to a defensible detection and investigation workflow:

```text
Real Telemetry
      |
      v
Ingestion
      |
      v
Normalization
      |
      v
Persistent Storage
      |
      v
Detection Engineering
      |
      v
Alert
      |
      v
Incident Correlation
      |
      v
Analyst Investigation
      |
      v
Evidence / Decision
```

## Running Locally

### Backend

From the repository root:

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is available at:

```text
http://127.0.0.1:8000
```

Health endpoint:

```text
http://127.0.0.1:8000/api/health
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

From the repository root:

```bash
npm install
npm run dev
```

The development frontend normally runs at:

```text
http://localhost:5173
```

## Engineering Principles

This project follows an evidence-first engineering approach:

1. Study existing systems.
2. Identify a concrete engineering gap.
3. Define the smallest useful implementation.
4. Build the implementation.
5. Test it.
6. Capture evidence.
7. Document limitations.
8. Expand only when the evidence justifies it.

The goal is not to create a dashboard full of security terminology.

The goal is to build a system where:

```text
Event ID
   ->
Rule ID
   ->
Alert ID
   ->
Incident ID
   ->
Analyst action
```

can be traced and explained.

## Security

Cyber-Threat-Monitor is intended for:

* security education
* defensive security engineering
* authorized testing
* controlled laboratory environments

Do not use this project to access systems, accounts, networks, or data without authorization.

## License

See `LICENSE` for the project source-available license and usage restrictions.

## Project Status

**Active development**

Current focus:

> Establish a reliable security monitoring and detection foundation before adding real telemetry and persistence.
