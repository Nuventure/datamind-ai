/**
 * Format utilities for displaying data in the UI
 */

/**
 * Formats a Date object into a user-friendly upload time string.
 * @param date - The date to format, or null
 * @param fallbackText - Text to show when date is null (default: "Just now")
 * @returns Formatted string like "Uploaded 02:30 PM" or fallback text
 */
export const formatUploadTime = (
  date: Date | null,
  fallbackText: string = "Just now",
): string => {
  if (!date) return fallbackText;
  return `Uploaded ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
};

/**
 * Converts pandas/numpy data types to user-friendly display names.
 * @param dtype - The data type string from pandas (e.g., "float64", "object")
 * @returns User-friendly type name (e.g., "Decimal", "Text")
 */
export const formatDataType = (dtype: string): string => {
  const typeMap: Record<string, string> = {
    object: "Text",
    int64: "Integer",
    int32: "Integer",
    float64: "Decimal",
    float32: "Decimal",
    bool: "Boolean",
    datetime64: "Date/Time",
    "datetime64[ns]": "Date/Time",
    category: "Category",
  };
  return typeMap[dtype.toLowerCase()] || dtype;
};
