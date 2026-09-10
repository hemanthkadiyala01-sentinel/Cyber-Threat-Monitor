from datetime import datetime, timezone

from pydantic import BaseModel, Field


class SecurityAlert(BaseModel):
    alert_id: str
    event_id: str
    rule_id: str
    title: str
    severity: str
    status: str = "open"
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    host: str | None = None
    source_ip: str | None = None
    description: str
    mitre_attack: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
