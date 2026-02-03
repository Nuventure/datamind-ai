export interface DataRow {
  user_id: string;
  transaction_ts: string;
  amount_usd: string;
  merchant_cat: string;
  risk_score: number;
  device_signature: string;
  zip_code: string;
  is_flagged: string;
}

export interface AnalysisDashboardProps {}
