export const VALID_FILE_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

export const FILE_EXTENSIONS_REGEX = /\.(xls|xlsx|csv)$/i;

export const UPLOAD_MESSAGES = {
  DRAG_DROP_HINT: "Drop your XLS or CSV file here",
  FILE_SPEC_HINT: "Supports .xls, .xlsx, .csv up to 10MB",
  SELECT_FILE: "Select File",
  UPLOADING: "Uploading...",
  UPLOAD_SUCCESS: "Upload Successful!",
  UPLOAD_FAILED: "Upload Failed",
  INVALID_FILE_TYPE: "Please upload an XLS, XLSX, or CSV file.",
  DEFAULT_ERROR: "Failed to upload file. Please try again.",
};
