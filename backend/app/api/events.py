from fastapi import APIRouter, Query

from app.models.events import SecurityEvent
from app.models.alerts import SecurityAlert
from app.services.pipeline import process_event
from app.services.storage import get_alerts as stored_alerts, get_events

router = APIRouter(prefix="/api/events", tags=["events"])


@router.post("", response_model=SecurityEvent, status_code=201)
def ingest_event(event: SecurityEvent):
    process_event(event)
    return event


@router.get("", response_model=list[SecurityEvent])
def list_events(limit: int = Query(default=200, ge=1, le=1000)):
    return get_events(limit)


@router.get("/alerts", response_model=list[SecurityAlert])
def list_event_alerts():
    return stored_alerts()
