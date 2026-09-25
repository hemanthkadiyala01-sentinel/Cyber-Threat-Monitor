import {
  Gauge,
  ShieldAlert,
  Siren,
  Radar,
  Database,
  Network,
  Settings
} from "lucide-react";

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Gauge, path: "/" },
  { id: "alerts", label: "Alerts", icon: Siren, path: "/alerts" },
  { id: "intel", label: "Threat Intel", icon: Radar, path: "/intel" },
  { id: "incidents", label: "Incidents", icon: ShieldAlert, path: "/incidents" },
  { id: "assets", label: "Asset Inventory", icon: Network, path: "/assets" },
  { id: "logs", label: "Log Sources", icon: Database, path: "/logs" },
  { id: "settings", label: "SOC Settings", icon: Settings, path: "/settings" }
];
