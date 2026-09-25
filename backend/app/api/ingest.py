import os

from fastapi import APIRouter, Header, HTTPException

from app.integrations.wazuh import normalize_wazuh_alert
from app.services.pipeline import process_event

router = APIRouter(prefix="/api/ingest", tags=["ingestion"])


def _authorize(api_key: str | None):
    expected = os.getenv("WAZUH_INGEST_API_KEY")
    if expected and api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid ingestion API key")


@router.post("/wazuh")
def ingest_wazuh(
    alert: dict,
    x_ctm_api_key: str | None = Header(default=None),
):
    _authorize(x_ctm_api_key)
    event = normalize_wazuh_alert(alert)
    alerts, incidents = process_event(event)
    return {
        "accepted": True,
        "event_id": event.event_id,
        "alert_ids": [alert.alert_id for alert in alerts],
        "incident_ids": [incident.incident_id for incident in incidents],
    }
