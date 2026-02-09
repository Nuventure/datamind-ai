import { apiClient } from "../axiosConfig";
import { Endpoints } from "../endpoints/endpoints";
import type {
  AnalysisSummaryResponse,
  AIInsightsResponse,
} from "../../pages/Dashboard/models/summaryPage.models";

export type { AnalysisSummaryResponse, AIInsightsResponse };

export const analysisApiService = {
  getAnalysisSummary: async (
    filename: string,
    signal?: AbortSignal,
  ): Promise<AnalysisSummaryResponse> => {
    const { data } = await apiClient.post<AnalysisSummaryResponse>(
      Endpoints.analysis.summary(filename),
      {},
      { signal },
    );
    return data;
  },

  getAIInsights: async (
    filename: string,
    signal?: AbortSignal,
  ): Promise<AIInsightsResponse> => {
    const { data } = await apiClient.post<AIInsightsResponse>(
      Endpoints.analysis.insights(filename),
      {},
      { signal },
    );
    return data;
  },
};
