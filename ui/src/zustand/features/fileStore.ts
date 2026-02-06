import { create } from "zustand";
import type { FileState } from "../models/fileStore.model";

export const useFileStore = create<FileState>((set) => ({
  uploadedFileName: null,
  uploadedAt: null,
  setUploadedFile: (fileName: string) =>
    set({ uploadedFileName: fileName, uploadedAt: new Date() }),
  clearUploadedFile: () => set({ uploadedFileName: null, uploadedAt: null }),
}));
