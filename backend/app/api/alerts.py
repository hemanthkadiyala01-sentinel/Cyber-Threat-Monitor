from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.models.alerts import SecurityAlert
from app.api.events import _alerts

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


class AlertStatusUpdate(BaseModel):
    status: str


VALID_STATUSES = {"open", "acknowledged", "resolved"}


@router.get("", response_model=list[SecurityAlert])
def get_alerts(
    severity: str | None = Query(default=None),
    status: str | None = Query(default=None),
):
    alerts = list(reversed(_alerts))

    if severity:
        alerts = [
            alert for alert in alerts
            if alert.severity.lower() == severity.lower()
        ]

    if status:
        alerts = [
            alert for alert in alerts
            if alert.status.lower() == status.lower()
        ]

    return alerts


@router.get("/{alert_id}", response_model=SecurityAlert)
def get_alert(alert_id: str):
    for alert in _alerts:
        if alert.alert_id == alert_id:
            return alert

    raise HTTPException(
        status_code=404,
        detail="Alert not found",
    )


@router.patch("/{alert_id}", response_model=SecurityAlert)
def update_alert_status(
    alert_id: str,
    update: AlertStatusUpdate,
):
    new_status = update.status.lower()

    if new_status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Invalid alert status",
        )

    for alert in _alerts:
        if alert.alert_id == alert_id:
            alert.status = new_status
            return alert

    raise HTTPException(
        status_code=404,
        detail="Alert not found",
    )
