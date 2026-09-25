from app.models.events import SecurityEvent
from app.services.detection import detect


def test_powershell_process_triggers_det_001():
    event = SecurityEvent(
        event_id="evt-001",
        source="windows",
        event_type="process_creation",
        host="WIN-SOC-LAB",
        process="powershell.exe",
        command_line="powershell.exe -NoProfile",
    )

    alerts = detect(event)

    assert [alert.rule_id for alert in alerts] == ["DET-001"]
    assert alerts[0].event_id == "evt-001"
    assert alerts[0].host == "WIN-SOC-LAB"
    assert alerts[0].severity == "medium"
    assert alerts[0].mitre_attack == ["T1059.001"]


def test_encoded_powershell_triggers_det_001_and_det_002():
    event = SecurityEvent(
        event_id="evt-002",
        source="windows",
        event_type="process_creation",
        host="WIN-SOC-LAB",
        process="powershell.exe",
        command_line="powershell.exe -EncodedCommand SQBtAHM=",
    )

    alerts = detect(event)

    assert [alert.rule_id for alert in alerts] == ["DET-001", "DET-002"]
    assert alerts[0].event_id == "evt-002"
    assert alerts[1].event_id == "evt-002"
    assert alerts[1].severity == "high"
    assert alerts[1].mitre_attack == ["T1059.001", "T1027"]


def test_non_powershell_process_does_not_trigger_rules():
    event = SecurityEvent(
        event_id="evt-003",
        source="windows",
        event_type="process_creation",
        host="WIN-SOC-LAB",
        process="notepad.exe",
        command_line="notepad.exe",
    )

    alerts = detect(event)

    assert alerts == []
