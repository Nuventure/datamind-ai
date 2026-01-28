import React, { useState } from "react";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Button from "../../../components/button/Button";
import { useFileUpload } from "../hooks/useFileUpload";

import {
  UPLOAD_MESSAGES,
  VALID_FILE_TYPES,
} from "../constants/dashboard.constants";

const Dashboard: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadStatus, errorMessage, onFileChange, onDrop } = useFileUpload();

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 pb-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Telemetry Overview
        </h1>
        <p className="text-slate-500">
          Upload and monitor device telemetry data in real-time.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload & History */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 ring-1 ring-slate-900/5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Upload size={20} />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">
                Upload Telemetry
              </h2>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                setIsDragging(false);
                onDrop(e);
              }}
              className={`
                                relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-200
                                ${isDragging ? "border-blue-400 bg-blue-50/50 scale-[1.02]" : "border-slate-200 hover:border-blue-300 bg-slate-50/30"}
                                ${uploadStatus === "uploading" ? "opacity-50 pointer-events-none" : ""}
                            `}
            >
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-blue-500">
                {uploadStatus === "uploading" ? (
                  <Loader2 size={32} className="animate-spin" />
                ) : uploadStatus === "success" ? (
                  <CheckCircle2 size={32} className="text-green-500" />
                ) : uploadStatus === "error" ? (
                  <AlertCircle size={32} className="text-red-500" />
                ) : (
                  <FileText size={32} />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">
                  {uploadStatus === "uploading"
                    ? UPLOAD_MESSAGES.UPLOADING
                    : uploadStatus === "success"
                      ? UPLOAD_MESSAGES.UPLOAD_SUCCESS
                      : uploadStatus === "error"
                        ? UPLOAD_MESSAGES.UPLOAD_FAILED
                        : UPLOAD_MESSAGES.DRAG_DROP_HINT}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {errorMessage || UPLOAD_MESSAGES.FILE_SPEC_HINT}
                </p>
              </div>
              <div className="mt-2 relative">
                <Button
                  leftIcon={uploadStatus === "uploading" ? Loader2 : Upload}
                  fullWidth
                  disabled={uploadStatus === "uploading"}
                >
                  {uploadStatus === "uploading"
                    ? UPLOAD_MESSAGES.UPLOADING
                    : UPLOAD_MESSAGES.SELECT_FILE}
                </Button>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  accept={VALID_FILE_TYPES.join(",")}
                  onChange={onFileChange}
                  disabled={uploadStatus === "uploading"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
