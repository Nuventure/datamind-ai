/**
 * Zustand store type definitions for file management
 */

export interface FileState {
  uploadedFileName: string | null;
  uploadedAt: Date | null;
  setUploadedFile: (fileName: string) => void;
  clearUploadedFile: () => void;
}
