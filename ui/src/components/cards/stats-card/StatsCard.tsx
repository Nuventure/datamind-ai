import React from "react";
import type { StatsCardProps, BadgeVariant } from "./StatsCard.models";

const badgeStyles: Record<BadgeVariant, string> = {
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20",
  default: "bg-neutral-800 text-neutral-400 border border-neutral-700",
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  valueClassName = "text-white",
  subtitle,
  secondarySubtitle,
  badge,
  badgeVariant = "default",
  icon: Icon,
}) => {
  return (
    <div className="bg-[#0A0A0A] rounded-lg p-5 border border-neutral-800 hover:border-neutral-700 transition-all duration-300">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && <Icon className="w-4 h-4 text-neutral-500" />}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${valueClassName}`}>{value}</span>
        {subtitle && (
          <span className="text-sm text-neutral-500">{subtitle}</span>
        )}
      </div>

      {/* Secondary Subtitle (Legacy, consider moving to badge if you want border) */}
      {secondarySubtitle && (
        <p className="text-sm text-blue-400 mt-1">{secondarySubtitle}</p>
      )}

      {/* Badge */}
      {badge && (
        <span
          className={`inline-block mt-3 px-2 py-1 rounded text-[10px] font-medium tracking-wide ${badgeStyles[badgeVariant]}`}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export default StatsCard;
