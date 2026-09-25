import importlib

from app.models.events import SecurityEvent


def test_event_alert_and_incident_persist(tmp_path, monkeypatch):
    db_path = tmp_path / "ctm.db"
    monkeypatch.setenv("CTM_DB_PATH", str(db_path))

    import app.db as db
    import app.services.storage as storage
    importlib.reload(db)
    importlib.reload(storage)

    from app.services.pipeline import process_event

    event = SecurityEvent(
        event_id="persist-001",
        source="windows",
        event_type="process_creation",
        host="WIN-SOC-LAB",
        process="powershell.exe",
        command_line="powershell.exe -NoProfile",
    )
    alerts, incidents = process_event(event)

    assert db_path.exists()
    assert len(alerts) == 1
    assert len(incidents) == 1
    assert storage.get_event("persist-001") is not None
    assert storage.get_alert(alerts[0].alert_id) is not None

    importlib.reload(db)
    importlib.reload(storage)

    assert storage.get_event("persist-001") is not None
    assert storage.get_alert(alerts[0].alert_id) is not None
    assert storage.get_incident(incidents[0].incident_id) is not None


def test_analyst_action_and_status_are_durable(tmp_path, monkeypatch):
    monkeypatch.setenv("CTM_DB_PATH", str(tmp_path / "ctm.db"))

    import app.db as db
    import app.services.storage as storage
    importlib.reload(db)
    importlib.reload(storage)

    from app.services.pipeline import process_event

    event = SecurityEvent(
        event_id="persist-002",
        source="windows",
        event_type="process_creation",
        host="WIN-SOC-LAB",
        process="powershell.exe",
        command_line="powershell.exe -EncodedCommand AAAA",
    )
    alerts, incidents = process_event(event)
    alert = alerts[0]
    incident = incidents[0]

    storage.update_alert_status(alert.alert_id, "acknowledged")
    storage.update_incident_status(incident.incident_id, "investigating")
    storage.add_analyst_action(
        "incident", incident.incident_id, "triage", "analyst",
        "Validated the process execution against the event evidence.",
    )

    assert storage.get_alert(alert.alert_id).status == "acknowledged"
    assert storage.get_incident(incident.incident_id).status == "investigating"
    assert len(storage.get_analyst_actions("incident", incident.incident_id)) == 1
