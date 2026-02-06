import { useState, useEffect, useCallback } from "react";
import { analysisApiService } from "../../../axios/api/analysisApiService";
import type {
  AnalysisSummaryResponse,
  ParsedSummary,
  AIInsightsResponse,
  UseSummaryAnalysisReturn,
} from "../models/summaryPage.models";

export const useSummaryAnalysis = (
  filename: string | null,
): UseSummaryAnalysisReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<AnalysisSummaryResponse | null>(null);
  const [parsedSummary, setParsedSummary] = useState<ParsedSummary | null>(
    null,
  );
  const [aiInsights, setAiInsights] = useState<AIInsightsResponse | null>(null);

  const parseSummaryData = useCallback(
    (data: AnalysisSummaryResponse): ParsedSummary => {
      const columns = Object.keys(data.metadata);
      const columnCount = columns.length;

      // Get row count from the first column's count stat
      const firstColSummary = Object.values(data.summary)[0];
      const rowCount = firstColSummary?.count || 0;

      // Calculate missing values
      const missingValuesCounts: Record<string, number> = {};
      let totalMissing = 0;
      columns.forEach((col) => {
        const missing = data.summary[col]?.missing_values || 0;
        missingValuesCounts[col] = missing;
        totalMissing += missing;
      });

      const totalCells = rowCount * columnCount;
      const totalMissingPercentage =
        totalCells > 0 ? (totalMissing / totalCells) * 100 : 0;

      // Extract numeric column statistics
      const numericStats = columns
        .filter((col) => {
          const stats = data.summary[col];
          return (
            stats?.mean !== undefined &&
            stats?.std !== undefined &&
            stats?.min !== undefined &&
            stats?.max !== undefined
          );
        })
        .map((col) => {
          const stats = data.summary[col];
          return {
            column: col,
            mean: stats.mean!,
            std: stats.std!,
            min: stats.min!,
            max: stats.max!,
            median: stats["50%"] || 0,
          };
        });

      return {
        rowCount,
        columnCount,
        columns,
        dataTypes: data.metadata,
        missingValuesCounts,
        totalMissingPercentage,
        numericStats,
      };
    },
    [],
  );

  const fetchAnalysis = useCallback(async () => {
    if (!filename) {
      setError("No filename provided");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch both summary and AI insights in parallel
      const [summaryData, insightsData] = await Promise.all([
        analysisApiService.getAnalysisSummary(filename),
        analysisApiService.getAIInsights(filename),
      ]);

      setRawData(summaryData);
      setParsedSummary(parseSummaryData(summaryData));
      setAiInsights(insightsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch analysis";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filename, parseSummaryData]);

  useEffect(() => {
    if (filename) {
      fetchAnalysis();
    }
  }, [filename, fetchAnalysis]);

  return {
    isLoading,
    error,
    rawData,
    parsedSummary,
    aiInsights,
    refetch: fetchAnalysis,
  };
};
