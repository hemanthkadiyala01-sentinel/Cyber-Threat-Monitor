from fastapi import APIRouter
from app.services.storage import get_metrics

router = APIRouter(prefix="/api/metrics", tags=["metrics"])


@router.get("")
def metrics():
    return get_metrics()
