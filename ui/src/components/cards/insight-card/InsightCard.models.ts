import type { ElementType } from "react";

export type InsightSeverity = "critical" | "warning" | "info" | "neutral";

export interface InsightCardProps {
  /** Insight title (e.g., "PII Detected", "Strong Correlation") */
  title: string;
  /** Description text explaining the insight */
  description: string;
  /** Severity level for visual styling */
  severity?: InsightSeverity;
  /** Optional custom icon override */
  icon?: ElementType;
  /** Optional action button label (e.g., "Review Privacy Policy →") */
  actionLabel?: string;
  /** Callback when action button is clicked */
  onAction?: () => void;
}
