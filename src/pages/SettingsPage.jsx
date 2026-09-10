import PagePlaceholder from "../components/ui/PagePlaceholder";

export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="SOC Settings"
      description="Configure alert policies, user roles, notification channels, and platform integrations."
      highlights={["Manage users", "Edit alert rules", "Configure webhooks", "Update SOC profile"]}
    />
  );
}
