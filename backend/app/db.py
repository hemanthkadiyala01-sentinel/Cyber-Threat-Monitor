from __future__ import annotations

import os
import sqlite3
from pathlib import Path

DEFAULT_DB_PATH = Path(__file__).resolve().parents[1] / "data" / "cyber_threat_monitor.db"

SCHEMA = """
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS events (
    event_id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    source TEXT NOT NULL,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    host TEXT,
    user_name TEXT,
    source_ip TEXT,
    destination_ip TEXT,
    process TEXT,
    command_line TEXT,
    message TEXT,
    mitre_attack TEXT NOT NULL DEFAULT '[]',
    tags TEXT NOT NULL DEFAULT '[]',
    raw_event TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS alerts (
    alert_id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    rule_id TEXT NOT NULL,
    title TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    host TEXT,
    source_ip TEXT,
    description TEXT NOT NULL,
    mitre_attack TEXT NOT NULL DEFAULT '[]',
    tags TEXT NOT NULL DEFAULT '[]',
    FOREIGN KEY(event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS incidents (
    incident_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    host TEXT,
    description TEXT NOT NULL,
    mitre_attack TEXT NOT NULL DEFAULT '[]',
    tags TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS incident_alerts (
    incident_id TEXT NOT NULL,
    alert_id TEXT NOT NULL UNIQUE,
    PRIMARY KEY (incident_id, alert_id),
    FOREIGN KEY(incident_id) REFERENCES incidents(incident_id) ON DELETE CASCADE,
    FOREIGN KEY(alert_id) REFERENCES alerts(alert_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS analyst_actions (
    action_id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    action TEXT NOT NULL,
    note TEXT,
    analyst TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_host ON events(host);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_host ON alerts(host);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_actions_target ON analyst_actions(target_type, target_id);
"""


def db_path() -> Path:
    configured = os.getenv("CTM_DB_PATH")
    return Path(configured).expanduser() if configured else DEFAULT_DB_PATH


def get_connection() -> sqlite3.Connection:
    path = db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path, timeout=10)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys=ON")
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.executescript(SCHEMA)


init_db()
