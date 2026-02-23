import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import Button from "../../../components/button/Button";
import { useFileStore } from "../../../zustand/features/fileStore";
import { useSummaryAnalysis } from "../hooks/useSummaryAnalysis";
import { SUMMARY_PAGE_LABELS } from "../constants/summaryPage.constants";
import { formatUploadTime, formatDataType } from "../../../utils/formatters";

const SummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { uploadedFileName, uploadedAt } = useFileStore();
  const { isLoading, error, parsedSummary, rawData, aiInsights } =
    useSummaryAnalysis(uploadedFileName);

  // Get top values for categorical columns
  const getTopValues = () => {
    if (!rawData?.summary) return [];
    const results: { column: string; topValue: string; freq: number }[] = [];

    Object.entries(rawData.summary).forEach(([col, stats]) => {
      if (stats.top && stats.freq) {
        results.push({
          column: col,
          topValue: String(stats.top),
          freq: stats.freq,
        });
      }
    });

    return results;
  };

  // Redirect to upload if no file
  React.useEffect(() => {
    if (!uploadedFileName) {
      navigate("/");
    }
  }, [uploadedFileName, navigate]);

  if (!uploadedFileName) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
          <p className="text-lg text-slate-300">
            {SUMMARY_PAGE_LABELS.LOADING_ANALYSIS}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const topValues = getTopValues();

  return (
    <div className="min-h-full text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-slate-700/50">
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              {SUMMARY_PAGE_LABELS.PAGE_TITLE}
            </h1>
            <p className="text-sm text-slate-400">
              {uploadedFileName} | {formatUploadTime(uploadedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">
              {SUMMARY_PAGE_LABELS.ANALYSIS_COMPLETE}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto space-y-8 transition-all duration-300">
        {/* DataMind Insights Card */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">
                {SUMMARY_PAGE_LABELS.DATAMIND_INSIGHTS}
              </h2>
              <p className="text-xs text-slate-500">
                {SUMMARY_PAGE_LABELS.JUST_NOW}
              </p>
            </div>
          </div>

          {/* AI Summary */}
          {aiInsights && (
            <p className="text-slate-300 leading-relaxed mb-6">
              {aiInsights.summary}
            </p>
          )}

          {/* Row/Column Stats */}
          {parsedSummary && (
            <div className="flex gap-4 mb-6">
              <div className="px-4 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30">
                <p className="text-2xl font-bold text-white">
                  {parsedSummary.rowCount.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">Rows</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30">
                <p className="text-2xl font-bold text-white">
                  {parsedSummary.columnCount}
                </p>
                <p className="text-xs text-slate-400">Columns</p>
              </div>
              {aiInsights && (
                <div className="px-4 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30">
                  <p className="text-2xl font-bold text-emerald-400">
                    {aiInsights.data_quality.score}%
                  </p>
                  <p className="text-xs text-slate-400">Data Quality</p>
                </div>
              )}
            </div>
          )}

          {/* Column Overview */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              COLUMN OVERVIEW
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {parsedSummary?.columns.map((col) => (
                <div
                  key={col}
                  className="px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30"
                >
                  <p className="text-sm font-medium text-white truncate">
                    {col}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDataType(parsedSummary.dataTypes[col])}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notable Trends - Top Values */}
          {topValues.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {SUMMARY_PAGE_LABELS.NOTABLE_TRENDS}
              </h3>
              <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    TOP VALUES BY COLUMN
                  </span>
                  <span className="text-xs text-slate-500">
                    N = {parsedSummary?.rowCount.toLocaleString()}
                  </span>
                </div>
                <div className="divide-y divide-slate-700/30">
                  {topValues.map(({ column, topValue, freq }) => (
                    <div
                      key={column}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div>
                        <span className="text-sm text-slate-300">{column}</span>
                        <span className="text-xs text-slate-500 ml-2">
                          → {topValue}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-cyan-400">
                        {freq} occurrences
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Numeric Column Statistics */}
          {parsedSummary && parsedSummary.numericStats.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                NUMERIC COLUMN STATISTICS
              </h3>
              <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50 bg-slate-800/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Column
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Min
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Max
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Mean
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Median
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Std Dev
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {parsedSummary.numericStats.map((stat) => (
                        <tr key={stat.column} className="hover:bg-slate-800/30">
                          <td className="px-4 py-3 text-slate-300 font-medium">
                            {stat.column}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-400 font-mono">
                            {stat.min.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-rose-400 font-mono">
                            {stat.max.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-cyan-400 font-mono">
                            {stat.mean.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-purple-400 font-mono">
                            {stat.median.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-amber-400 font-mono">
                            {stat.std.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Data Quality Alerts */}
          {aiInsights && aiInsights.data_quality.alerts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {SUMMARY_PAGE_LABELS.DATA_QUALITY_ALERTS}
              </h3>
              <div className="space-y-2">
                {aiInsights.data_quality.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-200"
                  >
                    {alert}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Trends */}
          {aiInsights && aiInsights.trends.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                KEY TRENDS & PATTERNS
              </h3>
              <div className="space-y-2">
                {aiInsights.trends.map((trend, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 rounded-lg bg-slate-700/30 border border-slate-600/30 text-sm text-slate-300"
                  >
                    {trend}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stat Highlights */}
          {aiInsights && aiInsights.stat_highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                KEY METRICS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiInsights.stat_highlights.map((stat, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 rounded-lg bg-slate-700/30 border border-slate-600/30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">
                        {stat.label}
                      </span>
                      <span className="text-lg font-bold text-cyan-400">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{stat.insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
