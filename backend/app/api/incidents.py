from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.models.incidents import SecurityIncident
from app.services.storage import (
    add_analyst_action, get_analyst_actions, get_incident,
    get_incident_evidence, get_incidents, update_incident_status,
)

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


class IncidentStatusUpdate(BaseModel):
    status: str


class AnalystActionCreate(BaseModel):
    action: str = Field(min_length=1, max_length=100)
    analyst: str = Field(default="analyst", min_length=1, max_length=100)
    note: str | None = Field(default=None, max_length=4000)


VALID_STATUSES = {"open", "investigating", "contained", "resolved", "closed"}


@router.get("", response_model=list[SecurityIncident])
def list_incidents(status: str | None = Query(default=None)):
    return get_incidents(status=status)


@router.get("/{incident_id}/evidence")
def incident_evidence(incident_id: str):
    evidence = get_incident_evidence(incident_id)
    if evidence is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return evidence


@router.get("/{incident_id}/actions")
def incident_actions(incident_id: str):
    if get_incident(incident_id) is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return get_analyst_actions("incident", incident_id)


@router.post("/{incident_id}/actions", status_code=201)
def create_incident_action(incident_id: str, action: AnalystActionCreate):
    if get_incident(incident_id) is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return add_analyst_action(
        "incident", incident_id, action.action, action.analyst, action.note
    )


@router.get("/{incident_id}", response_model=SecurityIncident)
def get_incident_by_id(incident_id: str):
    incident = get_incident(incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.patch("/{incident_id}", response_model=SecurityIncident)
def update_incident(incident_id: str, update: IncidentStatusUpdate):
    status = update.status.lower()
    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid incident status")
    incident = update_incident_status(incident_id, status)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident
