from datetime import datetime, timezone

from app.models.alerts import SecurityAlert
from app.models.incidents import SecurityIncident


def correlate_alerts(alerts: list[SecurityAlert]) -> list[SecurityIncident]:
    incidents: list[SecurityIncident] = []

    grouped: dict[str, list[SecurityAlert]] = {}

    for alert in alerts:
        host = alert.host or "unknown"
        grouped.setdefault(host, []).append(alert)

    for host, host_alerts in grouped.items():
        if not host_alerts:
            continue

        alert_ids = [alert.alert_id for alert in host_alerts]

        severities = {alert.severity.lower() for alert in host_alerts}

        if "critical" in severities:
            severity = "critical"
        elif "high" in severities:
            severity = "high"
        elif "medium" in severities:
            severity = "medium"
        else:
            severity = "low"

        mitre_attack = sorted(
            {
                technique
                for alert in host_alerts
                for technique in alert.mitre_attack
            }
        )

        tags = sorted(
            {
                tag
                for alert in host_alerts
                for tag in alert.tags
            }
        )

        incidents.append(
            SecurityIncident(
                incident_id=f"INC-{host}-{len(alert_ids)}",
                title="Correlated security activity",
                severity=severity,
                host=host,
                alert_ids=alert_ids,
                description=(
                    f"{len(alert_ids)} related security alert(s) "
                    f"were detected on host {host}."
                ),
                mitre_attack=mitre_attack,
                tags=tags,
            )
        )

    return incidents
