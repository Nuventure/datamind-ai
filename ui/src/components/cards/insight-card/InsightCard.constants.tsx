import { AlertTriangle, Info, ShieldAlert, HelpCircle } from "lucide-react";
import type { InsightSeverity } from "./InsightCard.models";

export const SEVERITY_CONFIG: Record<
  InsightSeverity,
  {
    defaultIcon: React.ElementType;
    color: string; // Text color
    borderColor: string; // Left border color
  }
> = {
  critical: {
    defaultIcon: ShieldAlert,
    color: "text-red-500",
    borderColor: "bg-red-500",
  },
  warning: {
    defaultIcon: AlertTriangle,
    color: "text-amber-500",
    borderColor: "bg-amber-500",
  },
  info: {
    defaultIcon: Info,
    color: "text-blue-500",
    borderColor: "bg-blue-500",
  },
  neutral: {
    defaultIcon: HelpCircle,
    color: "text-neutral-400",
    borderColor: "bg-neutral-600",
  },
};
