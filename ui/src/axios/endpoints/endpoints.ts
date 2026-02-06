export const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const Endpoints = {
  sheets: {
    upload: "/sheets/upload-file",
  },
  analysis: {
    summary: (filename: string) => `/analysis/${filename}`,
    rules: (filename: string) => `/analysis/${filename}/rules`,
    insights: (filename: string) => `/analysis/${filename}/insights`,
  },
};
