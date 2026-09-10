from app.models.alerts import SecurityAlert
from app.models.events import SecurityEvent
from app.services.rules import get_rules, match_rule


def detect(event: SecurityEvent) -> list[SecurityAlert]:
    alerts: list[SecurityAlert] = []

    for rule in get_rules():
        if not rule.enabled:
            continue

        if not match_rule(rule.rule_id, event):
            continue

        alerts.append(
            SecurityAlert(
                alert_id=f"{rule.rule_id}-{event.event_id}",
                event_id=event.event_id,
                rule_id=rule.rule_id,
                title=rule.name,
                severity=rule.severity,
                host=event.host,
                source_ip=event.source_ip,
                description=rule.description,
                mitre_attack=rule.mitre_attack,
                tags=rule.tags,
            )
        )

    return alerts
