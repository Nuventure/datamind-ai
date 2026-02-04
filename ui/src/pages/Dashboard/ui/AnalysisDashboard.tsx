import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  ArrowRight,
  ShieldAlert,
  Link,
  AlertCircle,
  Hash,
} from "lucide-react";
import StatsCard from "../../../components/cards/stats-card/StatsCard";
import SchemaCard from "../../../components/cards/schema-card/SchemaCard";
import InsightCard from "../../../components/cards/insight-card/InsightCard";
import DataTable from "../../../components/data-table/DataTable";
import Button from "../../../components/button/Button";
import { SAMPLE_DATA, COLUMNS } from "../constants/analysis.constants";
import type { AnalysisDashboardProps } from "../models/analysis.models";

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = () => {
  const navigate = useNavigate();
  return (
    <div className="flex text-white min-h-full -m-4">
      {/* Main Content */}
      <main className="flex-1 space-y-6 p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="VOLUME"
            value="1,240,500"
            subtitle="Rows"
            badge="45 Columns detected"
            badgeVariant="info"
          />
          <StatsCard
            title="DATA QUALITY"
            value="97.8%"
            valueClassName="text-emerald-400"
            subtitle="Valid"
            badge="2.2% Missing values"
            badgeVariant="warning"
          />
          <StatsCard
            title="DISTRIBUTION MODE"
            value="Time-Series"
            badge="Sorted by: transaction_ts"
            badgeVariant="info"
          />
          <StatsCard
            title="DATASET SIZE"
            value="145 MB"
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
                6 Key Features
              </span>
            </div>
            <button className="text-xs text-blue-400 hover:underline">
              View all 45 columns →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <SchemaCard
              columnName="user_id"
              dataType="INT64 • Primary Key"
              stat="100%"
              statLabel="Unique"
            />
            <SchemaCard
              columnName="transaction_ts"
              dataType="DATETIME • Index"
              alert
              alertLabel="No Nulls"
              alertVariant="info"
              statLabel="Quality"
            />
            <SchemaCard
              columnName="amount_usd"
              dataType="FLOAT • Continuous"
              alert
              alertLabel="Skewed"
              alertVariant="warning"
              statLabel="Distribution"
            />
            <SchemaCard
              columnName="merchant_cat"
              dataType="STRING • Categorical"
              stat="12"
              statLabel="Cardinality"
            />
            <SchemaCard
              columnName="risk_score"
              dataType="FLOAT • Range 0-1"
              stat="0.95"
              statLabel="Mean"
            />
            <SchemaCard
              columnName="device_signature"
              dataType="STRING • High Card"
              alert
              alertLabel="PII Risk"
              alertVariant="danger"
            />
          </div>
        </div>

        {/* Data Preview Table */}
        <DataTable
          title="Data Preview"
          subtitle="Displaying 100 rows"
          columns={COLUMNS}
          data={SAMPLE_DATA}
          sortable
          maxRows={6}
        />

        {/* CTA Button */}
        <div className="flex justify-end pt-4">
          <Button
            variant="primary"
            size="md"
            rightIcon={ArrowRight}
            onClick={() => navigate("/")}
          >
            Proceed to EDA
          </Button>
        </div>
      </main>

      {/* Right Sidebar - AI Insights */}
      <aside className="w-80 space-y-4 flex-shrink-0 border-l border-neutral-800 p-4">
        <InsightCard
          title="PII Detected"
          description="Column device_signature contains patterns resembling MAC addresses."
          severity="critical"
          icon={ShieldAlert}
        />

        <InsightCard
          title="Strong Correlation"
          description="amount_usd and risk_score show a positive correlation of 0.78 above $1,000."
          severity="info"
          icon={Link}
        />

        <InsightCard
          title="Missing Data"
          description="zip_code is missing in 20% of rows flagged as high risk."
          severity="warning"
          icon={AlertCircle}
        />

        <InsightCard
          title="Cardinality"
          description="merchant_cat has low cardinality (12). Suggest converting to ENUM."
          severity="neutral"
          icon={Hash}
        />
      </aside>
    </div>
  );
};

export default AnalysisDashboard;
