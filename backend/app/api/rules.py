from fastapi import APIRouter, HTTPException

from app.services.rules import get_rule, get_rules

router = APIRouter(prefix="/api/rules", tags=["rules"])


@router.get("")
def list_rules():
    return get_rules()


@router.get("/{rule_id}")
def read_rule(rule_id: str):
    rule = get_rule(rule_id)

    if rule is None:
        raise HTTPException(
            status_code=404,
            detail="Detection rule not found",
        )

    return rule
