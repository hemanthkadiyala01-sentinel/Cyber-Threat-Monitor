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

export const stats = [
  { label: "Threat Events / min", value: "482", trend: "+12.4% vs last hour", color: "text-cyan-300" },
  { label: "Critical Incidents", value: "17", trend: "+3 unresolved", color: "text-red-300" },
  { label: "Blocked Attempts", value: "1,208", trend: "99.1% mitigation rate", color: "text-emerald-300" },
  { label: "SOC Health Score", value: "92%", trend: "Operating nominally", color: "text-violet-300" }
];

export const trendData = [
  { label: "00:00", value: 22 },
  { label: "03:00", value: 38 },
  { label: "06:00", value: 28 },
  { label: "09:00", value: 52 },
  { label: "12:00", value: 61 },
  { label: "15:00", value: 44 },
  { label: "18:00", value: 70 },
  { label: "21:00", value: 56 }
];

export const threatAlerts = [
  { id: "a1", title: "Ransomware beacon detected", source: "185.24.6.19", target: "srv-fin-07", severity: "critical", time: "10s ago" },
  { id: "a2", title: "Credential stuffing burst", source: "91.102.44.12", target: "auth-gateway-2", severity: "high", time: "38s ago" },
  { id: "a3", title: "Suspicious PowerShell execution", source: "ws-224", target: "edr-agent", severity: "medium", time: "1m ago" },
  { id: "a4", title: "Data exfiltration attempt blocked", source: "db-node-3", target: "unknown-c2", severity: "critical", time: "2m ago" },
  { id: "a5", title: "WAF SQLi pattern match", source: "203.31.8.210", target: "portal-api", severity: "high", time: "4m ago" },
  { id: "a6", title: "Malicious DNS callback", source: "endpoint-118", target: "dns-resolver-1", severity: "medium", time: "7m ago" }
];
