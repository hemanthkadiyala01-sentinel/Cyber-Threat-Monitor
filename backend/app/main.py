from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.alerts import router as alerts_router
from app.api.events import router as events_router
from app.api.incidents import router as incidents_router
from app.api.ingest import router as ingest_router
from app.api.metrics import router as metrics_router
from app.api.rules import router as rules_router


app = FastAPI(
    title="Cyber-Threat-Monitor API",
    version="0.8.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events_router)
app.include_router(alerts_router)
app.include_router(rules_router)
app.include_router(incidents_router)
app.include_router(ingest_router)
app.include_router(metrics_router)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "cyber-threat-monitor-api",
        "version": "0.8.0",
    }
