from __future__ import annotations

import json
import os
import time
import urllib.request

ALERTS_FILE = os.getenv("WAZUH_ALERTS_FILE", "/var/ossec/logs/alerts/alerts.json")
CTM_API_URL = os.getenv("CTM_API_URL", "http://127.0.0.1:8000/api/ingest/wazuh")
POLL_SECONDS = float(os.getenv("WAZUH_POLL_SECONDS", "1"))
API_KEY = os.getenv("WAZUH_INGEST_API_KEY")


def post_alert(alert: dict):
    payload = json.dumps(alert).encode("utf-8")
    request = urllib.request.Request(
        CTM_API_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            **({"X-CTM-API-Key": API_KEY} if API_KEY else {}),
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=10) as response:
        return response.read()


def follow_file(path: str):
    with open(path, "r", encoding="utf-8") as stream:
        stream.seek(0, 2)
        while True:
            line = stream.readline()
            if not line:
                time.sleep(POLL_SECONDS)
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                continue


if __name__ == "__main__":
    print(f"Forwarding Wazuh alerts from {ALERTS_FILE} to {CTM_API_URL}")
    for alert in follow_file(ALERTS_FILE):
        try:
            post_alert(alert)
        except Exception as exc:
            print(f"Forwarding failed: {exc}")
            time.sleep(POLL_SECONDS)
