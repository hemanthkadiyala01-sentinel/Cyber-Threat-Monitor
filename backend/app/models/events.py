from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, Field


class SecurityEvent(BaseModel):
    event_id: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    source: str
    event_type: str
    severity: str = "info"
    host: str | None = None
    user: str | None = None
    source_ip: str | None = None
    destination_ip: str | None = None
    process: str | None = None
    command_line: str | None = None
    message: str | None = None
    mitre_attack: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    raw_event: dict[str, Any] = Field(default_factory=dict)
