from fastapi import APIRouter, HTTPException

from app.api.events import _alerts
from app.models.incidents import SecurityIncident
from app.services.incidents import correlate_alerts

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("", response_model=list[SecurityIncident])
def get_incidents():
    return correlate_alerts(_alerts)


@router.get("/{incident_id}", response_model=SecurityIncident)
def get_incident(incident_id: str):
    incidents = correlate_alerts(_alerts)

    for incident in incidents:
        if incident.incident_id == incident_id:
            return incident

    raise HTTPException(
        status_code=404,
        detail="Incident not found",
    )
