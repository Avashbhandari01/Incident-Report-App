"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ReportSubmittedProps {
  data: any;
  onComplete: (data: any) => void;
}

export function ReportSubmitted({ data }: ReportSubmittedProps) {
  const reportId = data.reportId || "ERROR-ID-NOT-FOUND";

  const [copied, setCopied] = useState(false);

  const handleCopy = (text: any) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center">
        <div className="bg-green-500/10 rounded-full p-3">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-medium text-white">
          Report Successfully Submitted
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Your report has been successfully submitted to emergency services
        </p>
      </div>

      <div className="bg-zinc-800/50 rounded-lg p-6 max-w-md mx-auto">
        <h4 className="text-white font-medium mb-2">Your Report ID</h4>
        <div className="bg-zinc-900 rounded p-3 flex items-center justify-between">
          <div className="flex-1 text-center">
            <code className="text-sky-400">{reportId}</code>
          </div>
          <button
            onClick={() => handleCopy(reportId)}
            className="text-white hover:text-gray-400 transition-all"
          >
            {copied ? (
              <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                <Check size={12} className="text-black" />
              </div>
            ) : (
              <Copy size={20} />
            )}
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          Save this ID to track your report status or connect with emergency
          response teams securely
        </p>
      </div>

      <div className="pt-4">
        <button
          onClick={() => (window.location.href = "/")}
          className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
