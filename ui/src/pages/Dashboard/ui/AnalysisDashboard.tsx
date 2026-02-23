import React from "react";
import {
  LayoutGrid,
  Link,
  AlertCircle,
  Hash,
  Loader2,
} from "lucide-react";
import StatsCard from "../../../components/cards/stats-card/StatsCard";
import SchemaCard from "../../../components/cards/schema-card/SchemaCard";
import InsightCard from "../../../components/cards/insight-card/InsightCard";
import DataTable from "../../../components/data-table/DataTable";
import { useFileStore } from "../../../zustand/features/fileStore";
import { useSummaryAnalysis } from "../hooks/useSummaryAnalysis";

const AnalysisDashboard: React.FC = () => {
  const { uploadedFileName } = useFileStore();
  const { isLoading, error, parsedSummary, aiInsights } = useSummaryAnalysis(uploadedFileName);

  if (isLoading || !parsedSummary || !aiInsights) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p>Analyzing dataset for deep insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-400 space-y-4">
        <AlertCircle className="w-8 h-8" />
        <p>Error loading analysis: {error}</p>
      </div>
    );
  }

  // Generate dynamic table columns
  const tableColumns = parsedSummary.columns.map((col) => ({
    key: col,
    header: col.toUpperCase(),
  }));

  // Infer distribution mode
  const hasDateTime = Object.values(parsedSummary.dataTypes).some(type => 
    type.toLowerCase().includes("date") || type.toLowerCase().includes("time")
  );
  const distributionMode = hasDateTime ? "Time-Series" : "Categorical";

  return (
    <div className="flex text-white min-h-full -m-4">
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex-1 space-y-6 overflow-auto pr-2">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="VOLUME"
              value={parsedSummary.rowCount.toLocaleString()}
              subtitle="Rows"
              badge={`${parsedSummary.columnCount} Columns detected`}
              badgeVariant="info"
            />
          <StatsCard
            title="DATA QUALITY"
            value={`${(100 - parsedSummary.totalMissingPercentage).toFixed(1)}%`}
            valueClassName="text-emerald-400"
            subtitle="Valid"
            badge={`${parsedSummary.totalMissingPercentage.toFixed(1)}% Missing values`}
            badgeVariant="warning"
          />
          <StatsCard
            title="DISTRIBUTION MODE"
            value={distributionMode}
            badge={`Based on column data types`}
            badgeVariant="info"
          />
          <StatsCard
            title="DATASET SIZE"
            value={`${parsedSummary.memoryUsageMb.toFixed(2)} MB`}
            badge="Estimated in-memory size"
            badgeVariant="default"
          />
        </div>

        {/* Schema Gallery */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-white" />
                <h2 className="text-sm font-semibold text-white">
                  Schema Gallery
                </h2>
              </div>
              <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] font-medium text-neutral-400">
                {Math.min(6, parsedSummary.columnCount)} Key Features
              </span>
            </div>
            <button className="text-xs text-blue-400 hover:underline">
              View all {parsedSummary.columnCount} columns →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {parsedSummary.columns.slice(0, 6).map((col) => {
              const dataType = parsedSummary.dataTypes[col] || "Unknown";
              const missingCount = parsedSummary.missingValuesCounts[col] || 0;
              const hasMissing = missingCount > 0;
              
              return (
                <SchemaCard
                  key={col}
                  columnName={col}
                  dataType={dataType.toUpperCase()}
                  alert={hasMissing}
                  alertLabel={hasMissing ? `${missingCount} Missing` : "No Nulls"}
                  alertVariant={hasMissing ? "warning" : "info"}
                  statLabel="Quality"
                />
              );
            })}
          </div>
        </div>

          {/* Data Preview Table */}
          <DataTable
            title="Data Preview"
            subtitle={`Displaying ${parsedSummary.headRows.length} rows`}
            columns={tableColumns}
            data={parsedSummary.headRows}
            sortable
            maxRows={6}
          />
        </div>
      </main>

      {/* Right Sidebar - AI Insights */}
      <aside className="w-80 space-y-4 flex-shrink-0 border-l border-neutral-800 p-4 overflow-y-auto">
        <div className="mb-6 flex justify-between items-center bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
          <span className="text-sm font-medium text-neutral-300">Data Health Score</span>
          <span className={`text-lg font-bold ${
            aiInsights.data_quality.score >= 90 ? 'text-emerald-400' :
            aiInsights.data_quality.score >= 70 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {aiInsights.data_quality.score}/100
          </span>
        </div>

        {aiInsights.data_quality.alerts.map((alert, index) => (
          <InsightCard
            key={`alert-${index}`}
            title="Data Quality Alert"
            description={alert}
            severity="warning"
            icon={AlertCircle}
          />
        ))}

        {aiInsights.trends.map((trend, index) => (
          <InsightCard
            key={`trend-${index}`}
            title="AI Trend Detected"
            description={trend}
            severity="info"
            icon={Hash}
          />
        ))}
        
        {aiInsights.stat_highlights.map((highlight, index) => (
          <InsightCard
            key={`stat-${index}`}
            title={highlight.label}
            description={highlight.insight}
            severity="neutral"
            icon={Link}
          />
        ))}
      </aside>
    </div>
  );
};

export default AnalysisDashboard;
