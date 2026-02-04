export type AlertVariant = "danger" | "warning" | "info";

export interface SchemaCardProps {
  /** Column name (e.g., "user_id", "amount_usd") */
  columnName: string;
  /** Data type (e.g., "INT64", "FLOAT", "STRING", "DATETIME") */
  dataType: string;
  /** Optional badge text (e.g., "Primary Key", "Index") */
  badge?: string;
  /** Statistic value (e.g., "100%", "0.95", "12") */
  stat?: string | number;
  /** Label for the statistic (e.g., "Unique", "Mean", "Cardinality") */
  statLabel?: string;
  /** Whether to show an alert indicator */
  alert?: boolean;
  /** Alert label text (e.g., "PII Risk", "Skewed", "No Nulls") */
  alertLabel?: string;
  /** Alert variant for styling */
  alertVariant?: AlertVariant;
}
