export interface ColumnSummary {
  count?: number;
  unique?: number | string;
  top?: string;
  freq?: number;
  mean?: number;
  std?: number;
  min?: number;
  "25%"?: number;
  "50%"?: number;
  "75%"?: number;
  max?: number;
  missing_values: number;
  unique_values: number;
  samples: (string | number)[];
}

export interface AnalysisSummaryResponse {
  metadata: Record<string, string>;
  summary: Record<string, ColumnSummary>;
}

export interface NumericStats {
  column: string;
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
}

export interface ParsedSummary {
  rowCount: number;
  columnCount: number;
  columns: string[];
  dataTypes: Record<string, string>;
  missingValuesCounts: Record<string, number>;
  totalMissingPercentage: number;
  numericStats: NumericStats[];
}

// AI Insights Response Types
export interface DataQuality {
  score: number;
  alerts: string[];
}

export interface StatHighlight {
  label: string;
  value: string;
  insight: string;
}

export interface AIInsightsResponse {
  summary: string;
  trends: string[];
  data_quality: DataQuality;
  stat_highlights: StatHighlight[];
}

// Hook Return Types
export interface UseSummaryAnalysisReturn {
  isLoading: boolean;
  error: string | null;
  rawData: AnalysisSummaryResponse | null;
  parsedSummary: ParsedSummary | null;
  aiInsights: AIInsightsResponse | null;
  refetch: () => Promise<void>;
}
