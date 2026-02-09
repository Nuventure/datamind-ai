import type { UploadStatus } from "../../pages/Dashboard/models/dashboard.types";

export interface FileState {
  uploadedFileName: string | null;
  uploadedAt: Date | null;
  uploadStatus: UploadStatus;
  errorMessage: string | null;
  selectedFile: File | null;
  setUploadedFile: (fileName: string) => void;
  setUploadStatus: (status: UploadStatus) => void;
  setErrorMessage: (message: string | null) => void;
  setSelectedFile: (file: File | null) => void;
  clearUploadedFile: () => void;
}
