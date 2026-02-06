export const SUMMARY_PAGE_LABELS = {
  PAGE_TITLE: "AI Analysis Summary",
  ANALYSIS_COMPLETE: "Analysis Complete",
  DATAMIND_INSIGHTS: "DataMind Insights",
  JUST_NOW: "Just now",
  NOTABLE_TRENDS: "NOTABLE TRENDS",
  DATA_QUALITY_ALERTS: "DATA QUALITY ALERTS",
  PROCEED_TO_EDA: "Proceed to EDA",
  LOADING_ANALYSIS: "Analyzing your data...",
  ERROR_NO_FILE: "No file uploaded. Please upload a file first.",
  ROWS: "rows",
  COLUMNS: "columns",
  PARSED_MESSAGE: (rows: number, cols: number) =>
    `I've successfully parsed **${rows.toLocaleString()} rows** and **${cols} columns**.`,
  HEALTH_SCORE_MESSAGE: (
    score: number,
    missingCol: string,
    percentage: string,
  ) =>
    `While the overall health is good (Score: ${score}/100), I found **missing values** in the \`${missingCol}\` column (approx. ${percentage}% of rows).`,
};

export const CHURN_RATE_TABLE = {
  TITLE: "CHURN RATE BY CONTRACT TYPE",
  SAMPLE_SIZE: "N = 50,000",
};
