import PagePlaceholder from "../components/ui/PagePlaceholder";

export default function ThreatIntelPage() {
  return (
    <PagePlaceholder
      title="Threat Intelligence"
      description="Track adversary infrastructure, IOC enrichment, and external threat feed correlation."
      highlights={["Search IOC", "Open CVE feed", "Create watchlist", "Sync intel sources"]}
    />
  );
}
