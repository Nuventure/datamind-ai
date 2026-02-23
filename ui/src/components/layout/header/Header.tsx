import React from "react";
import { Database, Sparkles, Upload } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../button/Button";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showAnalysisInfo = location.pathname === "/analysis";

  return (
    <header
      className={`sticky top-0 z-40 flex h-14 shrink-0 w-full items-center justify-between border-b border-neutral-800 bg-black pl-6 ${
        showAnalysisInfo ? "pr-0" : "pr-6"
      }`}
    >
      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Database className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-white">
            Data Mind <span className="text-slate-500 font-normal">v1.0</span>
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex h-full items-center">
        {/* Upload Button */}
        <div className={`flex items-center ${showAnalysisInfo ? "mr-6" : ""}`}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={Upload}
            onClick={() => navigate("/")}
            className="border-neutral-700 hover:bg-neutral-800 text-slate-300"
          >
            Upload New Data
          </Button>
        </div>

        {/* Data Health & AI Insights (only on analysis screen) */}
        {showAnalysisInfo && (
          <>
            <div className="flex items-center gap-2 ml-2 mr-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] rounded-full border border-neutral-800/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-sm font-medium text-slate-300">
                  Data Health: 94/100
                </span>
              </div>
            </div>

            <div className="flex h-full w-80 items-center gap-2 border-l border-neutral-800 px-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                AI Cognitive Insights
              </span>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
