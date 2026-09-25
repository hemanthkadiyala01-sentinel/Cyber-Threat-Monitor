from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone

from app.models.alerts import SecurityAlert
from app.models.events import SecurityEvent
from app.models.incidents import SecurityIncident
from app.db import get_connection


def _json(value) -> str:
    return json.dumps(value, separators=(",", ":"))


def _loads(value: str):
    return json.loads(value)


def save_event(event: SecurityEvent) -> None:
    with get_connection() as db:
        db.execute(
            """
            INSERT OR REPLACE INTO events
            (event_id, timestamp, source, event_type, severity, host, user_name,
             source_ip, destination_ip, process, command_line, message,
             mitre_attack, tags, raw_event)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                event.event_id, event.timestamp.isoformat(), event.source,
                event.event_type, event.severity, event.host, event.user,
                event.source_ip, event.destination_ip, event.process,
                event.command_line, event.message, _json(event.mitre_attack),
                _json(event.tags), _json(event.raw_event),
            ),
        )


def save_alert(alert: SecurityAlert) -> None:
    with get_connection() as db:
        db.execute(
            """
            INSERT OR REPLACE INTO alerts
            (alert_id, event_id, rule_id, title, severity, status, created_at,
             host, source_ip, description, mitre_attack, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                alert.alert_id, alert.event_id, alert.rule_id, alert.title,
                alert.severity, alert.status, alert.created_at.isoformat(),
                alert.host, alert.source_ip, alert.description,
                _json(alert.mitre_attack), _json(alert.tags),
            ),
        )


def _alert_from_row(row) -> SecurityAlert:
    return SecurityAlert(
        alert_id=row["alert_id"], event_id=row["event_id"],
        rule_id=row["rule_id"], title=row["title"], severity=row["severity"],
        status=row["status"], created_at=datetime.fromisoformat(row["created_at"]),
        host=row["host"], source_ip=row["source_ip"],
        description=row["description"],
        mitre_attack=_loads(row["mitre_attack"]),
        tags=_loads(row["tags"]),
    )


def _event_from_row(row) -> SecurityEvent:
    return SecurityEvent(
        event_id=row["event_id"], timestamp=datetime.fromisoformat(row["timestamp"]),
        source=row["source"], event_type=row["event_type"], severity=row["severity"],
        host=row["host"], user=row["user_name"], source_ip=row["source_ip"],
        destination_ip=row["destination_ip"], process=row["process"],
        command_line=row["command_line"], message=row["message"],
        mitre_attack=_loads(row["mitre_attack"]), tags=_loads(row["tags"]),
        raw_event=_loads(row["raw_event"]),
    )


def get_events(limit: int = 200) -> list[SecurityEvent]:
    with get_connection() as db:
        rows = db.execute(
            "SELECT * FROM events ORDER BY timestamp DESC LIMIT ?", (limit,)
        ).fetchall()
    return [_event_from_row(row) for row in rows]


def get_event(event_id: str) -> SecurityEvent | None:
    with get_connection() as db:
        row = db.execute("SELECT * FROM events WHERE event_id=?", (event_id,)).fetchone()
    return _event_from_row(row) if row else None


def get_alerts(severity: str | None = None, status: str | None = None) -> list[SecurityAlert]:
    clauses, params = [], []
    if severity:
        clauses.append("LOWER(severity)=LOWER(?)")
        params.append(severity)
    if status:
        clauses.append("LOWER(status)=LOWER(?)")
        params.append(status)
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    with get_connection() as db:
        rows = db.execute(
            f"SELECT * FROM alerts {where} ORDER BY created_at DESC", params
        ).fetchall()
    return [_alert_from_row(row) for row in rows]


def get_alert(alert_id: str) -> SecurityAlert | None:
    with get_connection() as db:
        row = db.execute("SELECT * FROM alerts WHERE alert_id=?", (alert_id,)).fetchone()
    return _alert_from_row(row) if row else None


def update_alert_status(alert_id: str, status: str) -> SecurityAlert | None:
    with get_connection() as db:
        cursor = db.execute(
            "UPDATE alerts SET status=? WHERE alert_id=?", (status, alert_id)
        )
        if cursor.rowcount == 0:
            return None
    return get_alert(alert_id)


def _severity(alerts: list[SecurityAlert]) -> str:
    levels = {alert.severity.lower() for alert in alerts}
    if "critical" in levels: return "critical"
    if "high" in levels: return "high"
    if "medium" in levels: return "medium"
    return "low"


def correlate_alert(alert: SecurityAlert) -> SecurityIncident:
    now = datetime.now(timezone.utc)
    with get_connection() as db:
        incident_id = None
        if alert.host:
            row = db.execute(
                """
                SELECT i.incident_id
                FROM incidents i
                WHERE i.host=? AND LOWER(i.status) NOT IN ('resolved','closed')
                ORDER BY i.updated_at DESC LIMIT 1
                """, (alert.host,)
            ).fetchone()
            incident_id = row["incident_id"] if row else None

        if incident_id is None:
            incident_id = f"INC-{uuid.uuid4().hex[:12].upper()}"
            db.execute(
                """
                INSERT INTO incidents
                (incident_id, title, severity, status, created_at, updated_at,
                 host, description, mitre_attack, tags)
                VALUES (?, ?, ?, 'open', ?, ?, ?, ?, ?, ?)
                """,
                (
                    incident_id, "Correlated security activity", alert.severity,
                    now.isoformat(), now.isoformat(), alert.host,
                    "Incident created from detection alert.",
                    _json(alert.mitre_attack), _json(alert.tags),
                ),
            )

        db.execute(
            "INSERT OR IGNORE INTO incident_alerts (incident_id, alert_id) VALUES (?, ?)",
            (incident_id, alert.alert_id),
        )

        rows = db.execute(
            """
            SELECT a.* FROM alerts a
            JOIN incident_alerts ia ON ia.alert_id=a.alert_id
            WHERE ia.incident_id=?
            ORDER BY a.created_at ASC
            """, (incident_id,)
        ).fetchall()
        alerts = [_alert_from_row(row) for row in rows]

        mitre = sorted({t for a in alerts for t in a.mitre_attack})
        tags = sorted({t for a in alerts for t in a.tags})
        severity = _severity(alerts)
        host = alert.host or "unknown"
        db.execute(
            """
            UPDATE incidents
            SET severity=?, updated_at=?, host=?, description=?, mitre_attack=?, tags=?
            WHERE incident_id=?
            """,
            (
                severity, now.isoformat(), alert.host,
                f"{len(alerts)} related security alert(s) were detected on host {host}.",
                _json(mitre), _json(tags), incident_id,
            ),
        )

    return get_incident(incident_id)


def get_incidents(status: str | None = None) -> list[SecurityIncident]:
    clauses, params = [], []
    if status:
        clauses.append("LOWER(status)=LOWER(?)")
        params.append(status)
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    with get_connection() as db:
        rows = db.execute(
            f"SELECT * FROM incidents {where} ORDER BY updated_at DESC", params
        ).fetchall()
        result = []
        for row in rows:
            alert_rows = db.execute(
                "SELECT alert_id FROM incident_alerts WHERE incident_id=? ORDER BY rowid",
                (row["incident_id"],),
            ).fetchall()
            result.append(_incident_from_row(row, [r["alert_id"] for r in alert_rows]))
    return result


def _incident_from_row(row, alert_ids: list[str]) -> SecurityIncident:
    return SecurityIncident(
        incident_id=row["incident_id"], title=row["title"],
        severity=row["severity"], status=row["status"],
        created_at=datetime.fromisoformat(row["created_at"]),
        updated_at=datetime.fromisoformat(row["updated_at"]),
        host=row["host"], alert_ids=alert_ids, description=row["description"],
        mitre_attack=_loads(row["mitre_attack"]), tags=_loads(row["tags"]),
    )


def get_incident(incident_id: str) -> SecurityIncident | None:
    with get_connection() as db:
        row = db.execute(
            "SELECT * FROM incidents WHERE incident_id=?", (incident_id,)
        ).fetchone()
        if not row:
            return None
        alert_rows = db.execute(
            "SELECT alert_id FROM incident_alerts WHERE incident_id=? ORDER BY rowid",
            (incident_id,)
        ).fetchall()
    return _incident_from_row(row, [r["alert_id"] for r in alert_rows])


def update_incident_status(incident_id: str, status: str) -> SecurityIncident | None:
    now = datetime.now(timezone.utc).isoformat()
    with get_connection() as db:
        cursor = db.execute(
            "UPDATE incidents SET status=?, updated_at=? WHERE incident_id=?",
            (status, now, incident_id),
        )
        if cursor.rowcount == 0:
            return None
    return get_incident(incident_id)


def add_analyst_action(target_type: str, target_id: str, action: str, analyst: str, note: str | None):
    now = datetime.now(timezone.utc).isoformat()
    with get_connection() as db:
        cursor = db.execute(
            """
            INSERT INTO analyst_actions
            (target_type, target_id, action, note, analyst, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (target_type, target_id, action, note, analyst, now),
        )
        action_id = cursor.lastrowid
    return {
        "action_id": action_id, "target_type": target_type,
        "target_id": target_id, "action": action, "note": note,
        "analyst": analyst, "created_at": now,
    }


def get_analyst_actions(target_type: str, target_id: str):
    with get_connection() as db:
        rows = db.execute(
            """
            SELECT action_id, target_type, target_id, action, note, analyst, created_at
            FROM analyst_actions WHERE target_type=? AND target_id=?
            ORDER BY created_at DESC
            """, (target_type, target_id)
        ).fetchall()
    return [dict(row) for row in rows]


def get_alert_evidence(alert_id: str):
    alert = get_alert(alert_id)
    if not alert:
        return None
    event = get_event(alert.event_id)
    incident = next(
        (item for item in get_incidents() if alert_id in item.alert_ids), None
    )
    return {
        "alert": alert.model_dump(mode="json"),
        "event": event.model_dump(mode="json") if event else None,
        "incident": incident.model_dump(mode="json") if incident else None,
        "analyst_actions": get_analyst_actions("alert", alert_id),
    }


def get_incident_evidence(incident_id: str):
    incident = get_incident(incident_id)
    if not incident:
        return None
    alerts = [a for aid in incident.alert_ids if (a := get_alert(aid))]
    events = [e.model_dump(mode="json") for a in alerts if (e := get_event(a.event_id))]
    return {
        "incident": incident.model_dump(mode="json"),
        "alerts": [a.model_dump(mode="json") for a in alerts],
        "events": events,
        "analyst_actions": get_analyst_actions("incident", incident_id),
    }


def get_metrics():
    with get_connection() as db:
        events = db.execute("SELECT COUNT(*) FROM events").fetchone()[0]
        alerts = db.execute("SELECT COUNT(*) FROM alerts").fetchone()[0]
        open_alerts = db.execute(
            "SELECT COUNT(*) FROM alerts WHERE status='open'"
        ).fetchone()[0]
        incidents = db.execute("SELECT COUNT(*) FROM incidents").fetchone()[0]
        open_incidents = db.execute(
            "SELECT COUNT(*) FROM incidents WHERE status='open'"
        ).fetchone()[0]
    return {
        "events": events, "alerts": alerts, "open_alerts": open_alerts,
        "incidents": incidents, "open_incidents": open_incidents,
    }
