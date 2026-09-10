from fastapi import FastAPI

from app.api.alerts import router as alerts_router
from app.api.events import router as events_router
from app.api.incidents import router as incidents_router
from app.api.rules import router as rules_router


app = FastAPI(
    title="Cyber-Threat-Monitor API",
    version="0.5.0",
)

app.include_router(events_router)
app.include_router(alerts_router)
app.include_router(rules_router)
app.include_router(incidents_router)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "cyber-threat-monitor-api",
        "version": "0.5.0",
    }
