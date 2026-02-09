import React, { useState } from "react";
import { Upload, Loader2, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button/Button";
import { useFileUpload } from "../hooks/useFileUpload";
import { useFileStore } from "../../../zustand/features/fileStore";

import {
  UPLOAD_MESSAGES,
  VALID_FILE_TYPES,
} from "../constants/dashboard.constants";
import { STATUS_CONFIG } from "../constants/dashboard.status";

const Dashboard: React.FC = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const {
    uploadStatus,
    errorMessage,
    selectedFile,
    uploadFile,
    onFileChange,
    onDrop,
    resetStatus,
    uploadedFileName,
  } = useFileUpload();
  const navigate = useNavigate();
  const { setUploadedFile, clearUploadedFile } = useFileStore();

  // Clear uploaded file when returning to Dashboard
  React.useEffect(() => {
    clearUploadedFile();
  }, [clearUploadedFile]);

  const currentStatus = STATUS_CONFIG[uploadStatus] || STATUS_CONFIG.idle;

  // Watch for success status and redirect
  const prevStatus = React.useRef(uploadStatus);
  React.useEffect(() => {
    if (
      uploadStatus === "success" &&
      prevStatus.current !== "success" &&
      uploadedFileName
    ) {
      setUploadedFile(uploadedFileName);
      navigate("/summary");
    }
    prevStatus.current = uploadStatus;
  }, [uploadStatus, uploadedFileName, navigate, setUploadedFile]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    onDrop(e);
  };

  return (
    <div className="min-h-full flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-2xl">
        {/* Upload Card */}
        <div className=" backdrop-blur-sm rounded-2xl p-8 ">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-all duration-200
              ${
                isDragging
                  ? "border-blue-400 bg-blue-500/10 scale-[1.02]"
                  : "border-slate-600 hover:border-slate-500 bg-slate-800/30"
              }
              ${
                uploadStatus === "uploading"
                  ? "opacity-50 pointer-events-none"
                  : ""
              }
            `}
          >
            {!selectedFile ? (
              <>
                <div className="p-4 rounded-2xl bg-slate-700/50 text-slate-400">
                  {currentStatus.icon}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-300">
                    {currentStatus.text}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {errorMessage || UPLOAD_MESSAGES.FILE_SPEC_HINT}
                  </p>
                </div>
                <div className="mt-2 relative">
                  <Button leftIcon={Upload}>
                    {UPLOAD_MESSAGES.SELECT_FILE}
                  </Button>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept={VALID_FILE_TYPES.join(",")}
                    onChange={handleFileChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-blue-500/20 text-blue-400">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  {errorMessage && (
                    <p className="text-sm text-red-500 mt-2 bg-red-500/10 py-1 px-3 rounded-md border border-red-500/20 inline-block">
                      {errorMessage}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Button
                    onClick={uploadFile}
                    leftIcon={
                      uploadStatus === "uploading" ? Loader2 : undefined
                    }
                    disabled={uploadStatus === "uploading"}
                    className={
                      uploadStatus === "uploading" ? "cursor-wait" : ""
                    }
                  >
                    {uploadStatus === "uploading" ? "Uploading..." : "Submit"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={resetStatus}
                    disabled={uploadStatus === "uploading"}
                    leftIcon={X}
                  >
                    Reset
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
