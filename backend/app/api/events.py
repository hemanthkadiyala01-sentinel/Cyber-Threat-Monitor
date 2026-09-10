from fastapi import APIRouter

from app.models.events import SecurityEvent
from app.models.alerts import SecurityAlert
from app.services.detection import detect

router = APIRouter(prefix="/api/events", tags=["events"])

_events: list[SecurityEvent] = []
_alerts: list[SecurityAlert] = []


@router.post("", response_model=SecurityEvent, status_code=201)
def ingest_event(event: SecurityEvent):
    _events.append(event)

    detected_alerts = detect(event)
    _alerts.extend(detected_alerts)

    return event


@router.get("", response_model=list[SecurityEvent])
def get_events():
    return list(reversed(_events))


@router.get("/alerts", response_model=list[SecurityAlert])
def get_alerts():
    return list(reversed(_alerts))
