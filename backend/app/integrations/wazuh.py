from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from app.models.events import SecurityEvent


def _nested(data: dict[str, Any], *path: str):
    current: Any = data
    for key in path:
        if not isinstance(current, dict):
            return None
        current = current.get(key)
    return current


def _first(data: dict[str, Any], *paths: tuple[str, ...]):
    for path in paths:
        value = _nested(data, *path)
        if value not in (None, ""):
            return value
    return None


def _severity(level: Any) -> str:
    try:
        level = int(level)
    except (TypeError, ValueError):
        return "info"
    if level >= 12: return "critical"
    if level >= 10: return "high"
    if level >= 7: return "medium"
    if level >= 4: return "low"
    return "info"


def normalize_wazuh_alert(alert: dict[str, Any]) -> SecurityEvent:
    event_id = str(
        alert.get("id")
        or f"wazuh-{alert.get('timestamp', datetime.now(timezone.utc).isoformat())}"
    )
    timestamp_text = alert.get("timestamp")
    try:
        timestamp = datetime.fromisoformat(
            str(timestamp_text).replace("Z", "+00:00")
        ) if timestamp_text else datetime.now(timezone.utc)
    except ValueError:
        timestamp = datetime.now(timezone.utc)

    event_code = _first(
        alert,
        ("data", "win", "system", "eventID"),
        ("win", "system", "eventID"),
    )
    event_type = "process_creation" if str(event_code) in {"1", "4688"} else "wazuh_alert"

    process = _first(
        alert,
        ("data", "win", "eventdata", "image"),
        ("data", "win", "eventdata", "originalFileName"),
        ("data", "win", "eventdata", "processName"),
    )
    command_line = _first(
        alert,
        ("data", "win", "eventdata", "commandLine"),
        ("data", "win", "eventdata", "commandline"),
    )
    user = _first(
        alert,
        ("data", "win", "eventdata", "user"),
        ("data", "win", "eventdata", "subjectUserName"),
    )
    host = _first(
        alert,
        ("agent", "name"),
        ("agent", "id"),
        ("data", "win", "system", "computer"),
    )
    source_ip = _first(alert, ("data", "srcip"), ("srcip",))
    destination_ip = _first(alert, ("data", "dstip"), ("dstip",))
    message = _first(
        alert, ("full_log",), ("data", "win", "system", "message")
    )

    return SecurityEvent(
        event_id=event_id,
        timestamp=timestamp,
        source="wazuh",
        event_type=event_type,
        severity=_severity(alert.get("rule", {}).get("level")),
        host=str(host) if host is not None else None,
        user=str(user) if user is not None else None,
        source_ip=str(source_ip) if source_ip is not None else None,
        destination_ip=str(destination_ip) if destination_ip is not None else None,
        process=str(process) if process is not None else None,
        command_line=str(command_line) if command_line is not None else None,
        message=str(message) if message is not None else None,
        mitre_attack=list(alert.get("rule", {}).get("mitre", {}).get("id", []) or []),
        tags=["wazuh", "real-telemetry"],
        raw_event=alert,
    )
