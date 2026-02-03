import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import type {
  UploadStatus,
  UseFileUploadReturn,
} from "../models/dashboard.types";
import { telemetryApiService } from "../../../axios/api/telemetryApiService";
import {
  VALID_FILE_TYPES,
  FILE_EXTENSIONS_REGEX,
  UPLOAD_MESSAGES,
} from "../constants/dashboard.constants";

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelection = useCallback((file: File) => {
    if (!file) return;

    // Validate file type
    if (
      !VALID_FILE_TYPES.includes(file.type) &&
      !file.name.match(FILE_EXTENSIONS_REGEX)
    ) {
      setUploadStatus("error");
      const errorMsg = UPLOAD_MESSAGES.INVALID_FILE_TYPE;
      setErrorMessage(errorMsg);
      // toast.error(errorMsg); // Optional: toast on select error? Better just show UI error.
      setSelectedFile(null);
      return;
    }

    // Valid file selected
    setSelectedFile(file);
    setUploadStatus("idle");
    setErrorMessage(null);
  }, []);

  const uploadFile = useCallback(async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setErrorMessage(null);
    const loadingToast = toast.loading(UPLOAD_MESSAGES.UPLOADING);

    try {
      await telemetryApiService.uploadTelemetryFile(selectedFile);
      setUploadStatus("success");
      toast.success(UPLOAD_MESSAGES.UPLOAD_SUCCESS, { id: loadingToast });
    } catch (error: unknown) {
      setUploadStatus("error");

      let errorMsg = UPLOAD_MESSAGES.DEFAULT_ERROR;
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
      toast.error(errorMsg, { id: loadingToast });
    }
  }, [selectedFile]);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelection(e.target.files[0]);
      }
    },
    [handleFileSelection],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelection],
  );

  const resetStatus = useCallback(() => {
    setUploadStatus("idle");
    setErrorMessage(null);
    setSelectedFile(null);
  }, []);

  return {
    uploadStatus,
    errorMessage,
    selectedFile,
    uploadFile,
    onFileChange,
    onDrop,
    resetStatus,
  };
};
