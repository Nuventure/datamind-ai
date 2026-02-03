import React from "react";
import { ChevronRight } from "lucide-react";
import { SEVERITY_CONFIG } from "./InsightCard.constants";
import type { InsightCardProps } from "./InsightCard.models";

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  severity = "info",
  icon,
  actionLabel,
  onAction,
}) => {
  const config = SEVERITY_CONFIG[severity];
  const IconComponent = icon || config.defaultIcon;

  // Highlight logic for description (rudimentary): wrap common patterns like snake_case in code tags
  const renderDescription = (text: string) => {
    const parts = text.split(/(\b[a-z0-9_]+_[a-z0-9_]+\b)/g);
    return parts.map((part, i) =>
      part.match(/^[a-z0-9_]+_[a-z0-9_]+$/) ? (
        <code
          key={i}
          className="font-mono text-[10px] bg-neutral-800 px-1 py-0.5 rounded text-neutral-300"
        >
          {part}
        </code>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-neutral-800 bg-[#0A0A0A] p-4 transition-all duration-300 hover:border-neutral-700">
      {/* Left Accent Bar */}
      <div
        className={`absolute bottom-0 left-0 top-0 w-1 ${config.borderColor}`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-2 pl-2">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <IconComponent className={`w-4 h-4 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="pl-2">
        <p className="text-xs text-neutral-400 leading-relaxed">
          {renderDescription(description)}
        </p>

        {/* Action Button */}
        {actionLabel && (
          <button
            onClick={onAction}
            className={`mt-3 flex items-center gap-1 text-[10px] font-medium ${config.color} hover:underline transition-all`}
          >
            {actionLabel}
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InsightCard;
