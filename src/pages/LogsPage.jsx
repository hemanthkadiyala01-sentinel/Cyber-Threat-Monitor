import PagePlaceholder from "../components/ui/PagePlaceholder";

export default function LogsPage() {
  return (
    <PagePlaceholder
      title="Log Sources"
      description="Manage SIEM ingestion pipelines for endpoint, network, identity, and cloud log streams."
      highlights={["Add source", "Validate parser", "Pause ingestion", "View pipeline health"]}
    />
  );
}
