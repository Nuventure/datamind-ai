import React from "react";
import type { SchemaCardProps, AlertVariant } from "./SchemaCard.models";

const alertColors: Record<AlertVariant, string> = {
  danger: "text-amber-500", // PII Risk / Alert (Orange/Amber)
  warning: "text-white", // Skewed (White based on screenshot)
  info: "text-white", // Default (White)
};

const SchemaCard: React.FC<SchemaCardProps> = ({
  columnName,
  dataType,
  stat,
  statLabel,
  alert,
  alertLabel,
  alertVariant = "info",
}) => {
  const valueColor = alert ? alertColors[alertVariant] : "text-white";
  const displayValue = alert ? alertLabel : stat;
  const displayLabel = alert && !statLabel ? "Alert" : statLabel;

  return (
    <div className="relative overflow-hidden rounded-lg border border-neutral-800 bg-[#0A0A0A] p-5 transition-all duration-300 hover:border-neutral-700">
      {/* Left Accent Bar */}
      <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500" />

      <div className="flex items-start justify-between pl-3">
        {/* Left Column: Name & Type */}
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-white">{columnName}</h3>
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            {dataType}
          </p>
        </div>

        {/* Right Column: Stat/Alert */}
        <div className="flex flex-col items-end gap-1">
          {displayValue && (
            <span className={`text-sm font-medium ${valueColor}`}>
              {displayValue}
            </span>
          )}
          {displayLabel && (
            <span className="text-[10px] text-neutral-500">{displayLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemaCard;
