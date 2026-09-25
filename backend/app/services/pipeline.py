from app.models.events import SecurityEvent
from app.services.detection import detect
from app.services.storage import correlate_alert, save_alert, save_event


def process_event(event: SecurityEvent):
    save_event(event)
    alerts = detect(event)
    incidents = []
    for alert in alerts:
        save_alert(alert)
        incident = correlate_alert(alert)
        if incident:
            incidents.append(incident)
    return alerts, incidents
