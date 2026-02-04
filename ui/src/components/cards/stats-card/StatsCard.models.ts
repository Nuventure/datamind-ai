import type { LucideIcon } from "lucide-react";

export type BadgeVariant =
  | "warning"
  | "success"
  | "info"
  | "default"
  | "danger";

export interface StatsCardProps {
  /** Card title displayed at the top (e.g., "VOLUME", "DATA QUALITY") */
  title: string;
  /** Primary value to display (e.g., "1,240,500", "97.8%") */
  value: string | number;
  /** Optional custom color class for the value text */
  valueClassName?: string;
  /** Optional subtitle text (e.g., "45 Columns detected", "Valid") */
  subtitle?: string;
  /** Optional secondary subtitle for additional context */
  secondarySubtitle?: string;
  /** Optional badge text (e.g., "2.2% Missing values") */
  badge?: string;
  /** Badge color variant */
  badgeVariant?: BadgeVariant;
  /** Optional icon to display */
  icon?: LucideIcon;
}
