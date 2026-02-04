import type { Column } from "../../../components/data-table/DataTable.models";
import type { DataRow } from "../models/analysis.models";

// Mock sample data
export const SAMPLE_DATA: DataRow[] = [
  {
    user_id: "u_892103",
    transaction_ts: "2023-10-24 14:02:11",
    amount_usd: "$124.50",
    merchant_cat: "Retail",
    risk_score: 0.02,
    device_signature: "dev_x92m_22",
    zip_code: "94103",
    is_flagged: "false",
  },
  {
    user_id: "u_892104",
    transaction_ts: "2023-10-24 14:03:05",
    amount_usd: "$12.99",
    merchant_cat: "Dining",
    risk_score: 0.01,
    device_signature: "dev_k811_11",
    zip_code: "10012",
    is_flagged: "false",
  },
  {
    user_id: "u_892105",
    transaction_ts: "2023-10-24 14:05:44",
    amount_usd: "$1,200.00",
    merchant_cat: "Travel",
    risk_score: 0.85,
    device_signature: "dev_p00p_99",
    zip_code: "null",
    is_flagged: "true",
  },
  {
    user_id: "u_892106",
    transaction_ts: "2023-10-24 14:08:12",
    amount_usd: "$45.20",
    merchant_cat: "Retail",
    risk_score: 0.03,
    device_signature: "dev_m22k_88",
    zip_code: "60614",
    is_flagged: "false",
  },
  {
    user_id: "u_892107",
    transaction_ts: "2023-10-24 14:10:01",
    amount_usd: "$88.00",
    merchant_cat: "Services",
    risk_score: 0.05,
    device_signature: "dev_f1lh_77",
    zip_code: "90210",
    is_flagged: "false",
  },
  {
    user_id: "u_892108",
    transaction_ts: "2023-10-24 14:12:33",
    amount_usd: "$210.50",
    merchant_cat: "Dining",
    risk_score: 0.12,
    device_signature: "dev_b44n_55",
    zip_code: "02139",
    is_flagged: "false",
  },
];

// Table columns definition
export const COLUMNS: Column<DataRow>[] = [
  { key: "user_id", header: "user_id" },
  { key: "transaction_ts", header: "transaction_ts" },
  { key: "amount_usd", header: "amount_usd" },
  { key: "merchant_cat", header: "merchant_cat" },
  {
    key: "risk_score",
    header: "risk_score",
    highlight: (value) => {
      const score = value as number;
      if (score >= 0.5) return "danger";
      if (score >= 0.1) return "warning";
      return null;
    },
  },
  { key: "device_signature", header: "device_signature" },
  { key: "zip_code", header: "zip_code" },
  {
    key: "is_flagged",
    header: "is_flagged",
    highlight: (value) => (value === "true" ? "danger" : null),
  },
];
