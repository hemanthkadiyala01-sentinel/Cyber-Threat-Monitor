import PagePlaceholder from "../components/ui/PagePlaceholder";

export default function AlertsPage() {
  return (
    <PagePlaceholder
      title="Threat Alerts"
      description="Review realtime detections, prioritize by severity, and trigger rapid containment actions."
      highlights={["Acknowledge alert", "Escalate to incident", "Mute noisy detector", "Export alert report"]}
    />
  );
}
