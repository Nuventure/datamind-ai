import { useState, useCallback } from "react";

import toast from "react-hot-toast";
import axios from "axios";
import type { UploadStatus } from "../models/dashboard.types";
import { telemetryApiService } from "../../../axios/api/telemetryApiService";
import {
  VALID_FILE_TYPES,
  FILE_EXTENSIONS_REGEX,
  UPLOAD_MESSAGES,
} from "../constants/dashboard.constants";

export const useFileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (
      !VALID_FILE_TYPES.includes(file.type) &&
      !file.name.match(FILE_EXTENSIONS_REGEX)
    ) {
      setUploadStatus("error");
      const errorMsg = UPLOAD_MESSAGES.INVALID_FILE_TYPE;
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setUploadStatus("uploading");
    setErrorMessage(null);
    const loadingToast = toast.loading(UPLOAD_MESSAGES.UPLOADING);

    try {
      await telemetryApiService.uploadTelemetryFile(file);
      setUploadStatus("success");
      toast.success(UPLOAD_MESSAGES.UPLOAD_SUCCESS, { id: loadingToast });
      // Reset status after 3 seconds
      setTimeout(() => setUploadStatus("idle"), 3000);
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
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files[0]);
      }
    },
    [handleFileUpload],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [handleFileUpload],
  );

  return {
    uploadStatus,
    errorMessage,
    handleFileUpload,
    onFileChange,
    onDrop,
  };
};
