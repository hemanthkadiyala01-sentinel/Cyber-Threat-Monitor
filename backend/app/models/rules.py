from typing import Callable

from pydantic import BaseModel, Field


class DetectionRule(BaseModel):
    rule_id: str
    name: str
    description: str
    severity: str
    mitre_attack: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    enabled: bool = True


RuleMatcher = Callable[[object], bool]
