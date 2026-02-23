import { create } from "zustand";
import type {
  AnalysisSummaryResponse,
  ParsedSummary,
  AIInsightsResponse,
} from "../../pages/Dashboard/models/summaryPage.models";

interface AnalysisState {
  cachedFileName: string | null;
  rawData: AnalysisSummaryResponse | null;
  parsedSummary: ParsedSummary | null;
  aiInsights: AIInsightsResponse | null;
  isLoading: boolean;
  error: string | null;

  setAnalysisData: (data: {
    rawData: AnalysisSummaryResponse;
    parsedSummary: ParsedSummary;
    aiInsights: AIInsightsResponse;
  }) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAnalysisData: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  cachedFileName: null,
  rawData: null,
  parsedSummary: null,
  aiInsights: null,
  isLoading: false,
  error: null,

  setAnalysisData: ({ rawData, parsedSummary, aiInsights }) =>
    set({
      rawData,
      parsedSummary,
      aiInsights,
      cachedFileName: rawData ? Object.keys(rawData.metadata)[0] || null : null,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  clearAnalysisData: () =>
    set({
      cachedFileName: null,
      rawData: null,
      parsedSummary: null,
      aiInsights: null,
      isLoading: false,
      error: null,
    }),
}));
