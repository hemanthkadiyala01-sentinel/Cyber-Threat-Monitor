const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let detail = `API request failed: ${response.status}`;
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // Keep the HTTP status message.
    }
    throw new Error(detail);
  }

  return response.json();
}

export function getHealth() {
  return request("/health");
}

export function getMetrics() {
  return request("/metrics");
}

export function getEvents(params = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", params.limit);
  const suffix = query.toString() ? `?${query}` : "";
  return request(`/events${suffix}`);
}

export function getAlerts(params = {}) {
  const query = new URLSearchParams();
  if (params.severity) query.set("severity", params.severity);
  if (params.status) query.set("status", params.status);
  const suffix = query.toString() ? `?${query}` : "";
  return request(`/alerts${suffix}`);
}

export function getAlert(alertId) {
  return request(`/alerts/${encodeURIComponent(alertId)}`);
}

export function getAlertEvidence(alertId) {
  return request(`/alerts/${encodeURIComponent(alertId)}/evidence`);
}

export function updateAlertStatus(alertId, status) {
  return request(`/alerts/${encodeURIComponent(alertId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function addAlertAction(alertId, payload) {
  return request(`/alerts/${encodeURIComponent(alertId)}/actions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getIncidents(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  const suffix = query.toString() ? `?${query}` : "";
  return request(`/incidents${suffix}`);
}

export function getIncident(incidentId) {
  return request(`/incidents/${encodeURIComponent(incidentId)}`);
}

export function getIncidentEvidence(incidentId) {
  return request(`/incidents/${encodeURIComponent(incidentId)}/evidence`);
}

export function updateIncidentStatus(incidentId, status) {
  return request(`/incidents/${encodeURIComponent(incidentId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function addIncidentAction(incidentId, payload) {
  return request(`/incidents/${encodeURIComponent(incidentId)}/actions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
