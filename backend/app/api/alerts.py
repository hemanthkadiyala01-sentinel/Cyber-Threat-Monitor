from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.models.alerts import SecurityAlert
from app.services.storage import (
    add_analyst_action, get_alert, get_alert_evidence, get_alerts,
    get_analyst_actions, update_alert_status,
)

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


class AlertStatusUpdate(BaseModel):
    status: str


class AnalystActionCreate(BaseModel):
    action: str = Field(min_length=1, max_length=100)
    analyst: str = Field(default="analyst", min_length=1, max_length=100)
    note: str | None = Field(default=None, max_length=4000)


VALID_STATUSES = {"open", "acknowledged", "resolved"}


@router.get("", response_model=list[SecurityAlert])
def list_alerts(
    severity: str | None = Query(default=None),
    status: str | None = Query(default=None),
):
    return get_alerts(severity=severity, status=status)


@router.get("/{alert_id}/evidence")
def alert_evidence(alert_id: str):
    evidence = get_alert_evidence(alert_id)
    if evidence is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return evidence


@router.get("/{alert_id}/actions")
def alert_actions(alert_id: str):
    if get_alert(alert_id) is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return get_analyst_actions("alert", alert_id)


@router.post("/{alert_id}/actions", status_code=201)
def create_alert_action(alert_id: str, action: AnalystActionCreate):
    if get_alert(alert_id) is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return add_analyst_action(
        "alert", alert_id, action.action, action.analyst, action.note
    )


@router.get("/{alert_id}", response_model=SecurityAlert)
def get_alert_by_id(alert_id: str):
    alert = get_alert(alert_id)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.patch("/{alert_id}", response_model=SecurityAlert)
def update_alert(alert_id: str, update: AlertStatusUpdate):
    status = update.status.lower()
    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid alert status")
    alert = update_alert_status(alert_id, status)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
