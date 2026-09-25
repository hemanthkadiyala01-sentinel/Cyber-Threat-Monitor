from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_wazuh_ingest_creates_persisted_detection():
    raw = {
        "id": "wazuh-api-001",
        "timestamp": "2026-09-26T01:00:00.000+00:00",
        "agent": {"id": "001", "name": "WIN-SOC-LAB"},
        "rule": {"level": 10, "description": "Windows process created"},
        "data": {
            "win": {
                "system": {"eventID": "4688", "computer": "WIN-SOC-LAB"},
                "eventdata": {
                    "image": "C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe",
                    "commandLine": "powershell.exe -NoProfile",
                    "subjectUserName": "analyst",
                },
            }
        },
    }

    response = client.post("/api/ingest/wazuh", json=raw)

    assert response.status_code == 200
    body = response.json()
    assert body["accepted"] is True
    assert body["event_id"] == "wazuh-api-001"
    assert body["alert_ids"] == ["DET-001-wazuh-api-001"]
    assert len(body["incident_ids"]) == 1
