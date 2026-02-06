import React from "react";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface StatusItem {
  icon: React.ReactNode;
  text: string;
}

export interface UseFileUploadReturn {
  uploadStatus: UploadStatus;
  errorMessage: string | null;
  selectedFile: File | null;
  uploadedFileName: string | null;
  uploadFile: () => Promise<void>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  resetStatus: () => void;
}
