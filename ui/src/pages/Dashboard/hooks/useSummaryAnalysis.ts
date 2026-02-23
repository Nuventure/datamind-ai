import { useEffect, useCallback } from "react";
import axios from "axios";
import { analysisApiService } from "../../../axios/api/analysisApiService";
import { useAnalysisStore } from "../../../zustand/features/analysisStore";
import type {
  AnalysisSummaryResponse,
  ParsedSummary,
  UseSummaryAnalysisReturn,
} from "../models/summaryPage.models";

export const useSummaryAnalysis = (
  filename: string | null,
): UseSummaryAnalysisReturn => {
  const {
    cachedFileName,
    rawData,
    parsedSummary,
    aiInsights,
    isLoading,
    error,
    setAnalysisData,
    setLoading,
    setError,
  } = useAnalysisStore();

  const parseSummaryData = useCallback(
    (data: AnalysisSummaryResponse): ParsedSummary => {
      const columns = Object.keys(data.metadata);
      const columnCount = columns.length;

      const firstColSummary = Object.values(data.summary)[0];
      const rowCount = firstColSummary?.count || 0;

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
        memoryUsageMb: data.memory_usage_mb || 0,
        headRows: data.head_rows || [],
      };
    },
    [],
  );

  const fetchAnalysis = useCallback(
    async (signal?: AbortSignal) => {
      if (!filename) {
        setError("No filename provided");
        return;
      }

      if (cachedFileName === filename && rawData && parsedSummary && aiInsights) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [summaryData, insightsData] = await Promise.all([
          analysisApiService.getAnalysisSummary(filename, signal),
          analysisApiService.getAIInsights(filename, signal),
        ]);

        if (signal?.aborted) return;

        const parsed = parseSummaryData(summaryData);
        setAnalysisData({
          rawData: summaryData,
          parsedSummary: parsed,
          aiInsights: insightsData,
        });
      } catch (err) {
        if (axios.isAxiosError(err) && err.name === "CanceledError") {
          return;
        }
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch analysis";
        setError(errorMessage);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [filename, cachedFileName, rawData, parsedSummary, aiInsights, parseSummaryData, setAnalysisData, setLoading, setError],
  );

  useEffect(() => {
    const controller = new AbortController();

    if (filename) {
      fetchAnalysis(controller.signal);
    }

    return () => {
      controller.abort();
    };
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
