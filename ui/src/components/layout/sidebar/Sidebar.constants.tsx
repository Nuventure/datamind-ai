import { Cloud, BarChart3, Workflow, AlertTriangle } from "lucide-react";

export const NAV_ITEMS = [
  { name: "Upload", icon: Cloud, path: "/" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Connections", icon: Workflow, path: "/connections" },
  { name: "Alerts", icon: AlertTriangle, path: "/alerts" },
] as const;
