import type { ReactNode } from "react";

export type HighlightVariant = "danger" | "warning" | "success" | null;

export interface Column<T> {
  /** Unique key for the column, must match a property in the data object */
  key: keyof T;
  /** Header text to display */
  header: string;
  /** Optional custom render function */
  render?: (value: T[keyof T], row: T) => ReactNode;
  /** Optional function to determine cell highlight */
  highlight?: (value: T[keyof T], row: T) => HighlightVariant;
  /** Column alignment */
  align?: "left" | "center" | "right";
  /** Column width (e.g., "150px", "20%") */
  width?: string;
}

export interface DataTableProps<T extends object> {
  /** Column definitions */
  columns: Column<T>[];
  /** Data array to display */
  data: T[];
  /** Enable column sorting */
  sortable?: boolean;
  /** Maximum rows to display */
  maxRows?: number;
  /** Empty state message */
  emptyMessage?: string;
  /** Optional table title */
  title?: string;
  /** Optional subtitle showing row count */
  subtitle?: string;
}

export interface SortConfig<T> {
  key: keyof T | null;
  direction: "asc" | "desc";
}
