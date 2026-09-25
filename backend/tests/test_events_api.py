from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_ingest_event_creates_detection_alert():
    event = {
        "event_id": "api-test-001",
        "source": "windows",
        "event_type": "process_creation",
        "severity": "info",
        "host": "WIN-SOC-LAB",
        "user": "analyst",
        "process": "powershell.exe",
        "command_line": "powershell.exe -NoProfile",
    }

    response = client.post("/api/events", json=event)

    assert response.status_code == 201
    assert response.json()["event_id"] == "api-test-001"

    alerts_response = client.get("/api/events/alerts")

    assert alerts_response.status_code == 200

    alerts = alerts_response.json()
    matching_alerts = [
        alert for alert in alerts if alert["event_id"] == "api-test-001"
    ]

    assert len(matching_alerts) == 1
    assert matching_alerts[0]["rule_id"] == "DET-001"
    assert matching_alerts[0]["severity"] == "medium"
    assert matching_alerts[0]["host"] == "WIN-SOC-LAB"
