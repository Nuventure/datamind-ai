import { create } from "zustand";
import type { FileState } from "../models/fileStore.model";

export const useFileStore = create<FileState>((set) => ({
  uploadedFileName: null,
  uploadedAt: null,
  uploadStatus: "idle",
  errorMessage: null,
  selectedFile: null,

  setUploadedFile: (fileName: string) =>
    set({ uploadedFileName: fileName, uploadedAt: new Date() }),

  setUploadStatus: (status) => set({ uploadStatus: status }),

  setErrorMessage: (message) => set({ errorMessage: message }),

  setSelectedFile: (file) => set({ selectedFile: file }),

  clearUploadedFile: () =>
    set({
      uploadedFileName: null,
      uploadedAt: null,
      uploadStatus: "idle",
      errorMessage: null,
      selectedFile: null,
    }),
}));
