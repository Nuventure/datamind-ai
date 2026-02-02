import { FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { UPLOAD_MESSAGES } from "./dashboard.constants";
import type { UploadStatus, StatusItem } from "../models/dashboard.types";

export const STATUS_CONFIG: Record<UploadStatus, StatusItem> = {
  uploading: {
    icon: <Loader2 size={32} className="animate-spin" />,
    text: UPLOAD_MESSAGES.UPLOADING,
  },
  success: {
    icon: <CheckCircle2 size={32} className="text-green-500" />,
    text: UPLOAD_MESSAGES.UPLOAD_SUCCESS,
  },
  error: {
    icon: <AlertCircle size={32} className="text-red-500" />,
    text: UPLOAD_MESSAGES.UPLOAD_FAILED,
  },
  idle: {
    icon: <FileText size={32} />,
    text: UPLOAD_MESSAGES.DRAG_DROP_HINT,
  },
} as const;
