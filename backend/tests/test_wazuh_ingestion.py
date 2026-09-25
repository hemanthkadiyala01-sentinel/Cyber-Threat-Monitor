from app.integrations.wazuh import normalize_wazuh_alert


def test_wazuh_windows_process_creation_normalizes_to_security_event():
    raw = {
        "id": "wazuh-001",
        "timestamp": "2026-09-26T01:00:00.000+00:00",
        "agent": {"id": "001", "name": "WIN-SOC-LAB"},
        "rule": {
            "level": 10,
            "description": "Windows process created",
            "mitre": {"id": ["T1059.001"]},
        },
        "data": {
            "win": {
                "system": {"eventID": "4688", "computer": "WIN-SOC-LAB"},
                "eventdata": {
                    "image": "C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe",
                    "commandLine": "powershell.exe -EncodedCommand AAAA",
                    "subjectUserName": "analyst",
                },
            }
        },
    }

    event = normalize_wazuh_alert(raw)

    assert event.source == "wazuh"
    assert event.event_type == "process_creation"
    assert event.host == "WIN-SOC-LAB"
    assert event.process.endswith("powershell.exe")
    assert event.command_line.endswith("-EncodedCommand AAAA")
    assert event.severity == "high"
    assert event.raw_event["id"] == "wazuh-001"
