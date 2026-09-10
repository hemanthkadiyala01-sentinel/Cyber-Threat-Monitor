from app.models.events import SecurityEvent
from app.models.rules import DetectionRule


RULES: dict[str, DetectionRule] = {
    "DET-001": DetectionRule(
        rule_id="DET-001",
        name="PowerShell Process Execution",
        description="Detects execution of powershell.exe on an endpoint.",
        severity="medium",
        mitre_attack=["T1059.001"],
        tags=["endpoint", "powershell", "process_creation"],
    ),
    "DET-002": DetectionRule(
        rule_id="DET-002",
        name="Encoded PowerShell Command",
        description="Detects PowerShell commands using encoded-command arguments.",
        severity="high",
        mitre_attack=["T1059.001", "T1027"],
        tags=["endpoint", "powershell", "obfuscated"],
    ),
}


def get_rules() -> list[DetectionRule]:
    return list(RULES.values())


def get_rule(rule_id: str) -> DetectionRule | None:
    return RULES.get(rule_id)


def match_rule(rule_id: str, event: SecurityEvent) -> bool:
    if rule_id == "DET-001":
        return (
            event.event_type == "process_creation"
            and event.process is not None
            and event.process.lower() == "powershell.exe"
        )

    if rule_id == "DET-002":
        if (
            event.event_type != "process_creation"
            or event.process is None
            or event.process.lower() != "powershell.exe"
            or event.command_line is None
        ):
            return False

        command = event.command_line.lower()

        return (
            "-enc " in command
            or "-encodedcommand " in command
        )

    return False
