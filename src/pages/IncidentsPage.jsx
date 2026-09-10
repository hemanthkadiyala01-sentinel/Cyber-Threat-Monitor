import PagePlaceholder from "../components/ui/PagePlaceholder";

export default function IncidentsPage() {
  return (
    <PagePlaceholder
      title="Incident Response"
      description="Coordinate SOC investigations, assign responders, and track containment-to-recovery lifecycle."
      highlights={["Open war room", "Assign analyst", "Update timeline", "Close incident"]}
    />
  );
}
