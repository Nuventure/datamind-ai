import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, LayoutGrid } from "lucide-react";
import type {
  DataTableProps,
  SortConfig,
  HighlightVariant,
  Column,
} from "./DataTable.models";

const highlightStyles: Record<NonNullable<HighlightVariant>, string> = {
  danger: "text-red-500 font-bold", // Red 0.85, true
  warning: "text-amber-500 font-medium",
  success: "text-emerald-500 font-medium",
};

const alignStyles = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function DataTable<T extends object>({
  columns,
  data,
  sortable = true,
  maxRows,
  emptyMessage = "No data available",
  title,
  subtitle,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: "transaction_ts" as keyof T,
    direction: "desc",
  });

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof T];
      const bVal = b[sortConfig.key as keyof T];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  // Apply max rows limit
  const displayData = maxRows ? sortedData.slice(0, maxRows) : sortedData;

  const handleSort = (key: keyof T) => {
    if (!sortable) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key];
    const highlight = column.highlight?.(value, row);

    // Special handling for null/undefined to match screenshot "null"
    if (value === "null" || value === null || value === undefined) {
      return <span className="text-neutral-500 italic">null</span>;
    }

    const highlightClass = highlight
      ? highlightStyles[highlight]
      : "text-neutral-300";

    const content = column.render ? column.render(value, row) : String(value);

    return <span className={highlightClass}>{content}</span>;
  };

  return (
    <div className="bg-[#0A0A0A] rounded-lg border border-neutral-800 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 border-b border-neutral-800 space-y-4">
        {/* Top Row: Title & Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white">{title}</h3>
          </div>
          {subtitle && (
            <span className="bg-neutral-800 px-2 py-1 rounded text-[10px] text-neutral-400">
              {subtitle.replace("Displaying ", "")} rows
            </span>
          )}
        </div>

        {/* Toolbar Row: Filter/Sort Buttons */}
        <div className="flex items-center gap-2">
          {/* Filter Button (Static for UI match) */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-neutral-800 bg-black text-xs text-neutral-400 hover:border-neutral-700 transition-colors">
            <span className="text-neutral-600">Filter:</span>
            <span className="text-white">None</span>
          </button>

          {/* Sort Button (Dynamic) */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-neutral-800 bg-black text-xs text-neutral-400 hover:border-neutral-700 transition-colors">
            <span className="text-neutral-600">Sort:</span>
            <span className="text-white">
              {String(sortConfig.key)} ({sortConfig.direction.toUpperCase()})
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800 bg-black">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  onClick={() => handleSort(column.key)}
                  className={`px-4 py-3 text-xs font-bold text-neutral-500 font-mono uppercase tracking-wider cursor-pointer hover:text-neutral-300 transition-colors ${alignStyles[column.align || "left"]}`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    {column.header}
                    {sortable &&
                      sortConfig.key === column.key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 bg-black">
            {displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-neutral-500 font-mono"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              displayData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-neutral-900/50 transition-colors border-b border-neutral-900"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-3 text-xs font-mono ${alignStyles[column.align || "left"]}`}
                    >
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
