"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import { BurnRateArtifact } from "@/lib/ai/artifacts/burn-rate";

export function BurnRateLoading() {
  const burnRateData = useArtifact(BurnRateArtifact);

  if (!burnRateData?.data || burnRateData.data.stage === "complete") {
    return null;
  }

  const getStageText = (stage: string) => {
    switch (stage) {
      case "loading":
        return "Initializing analysis...";
      case "processing":
        return "Processing financial data...";
      case "analyzing":
        return "Analyzing trends and generating insights...";
      default:
        return "Analyzing data...";
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-gray-500">{getStageText(burnRateData.data.stage)}</p>
        {burnRateData.data.progress > 0 && (
          <div className="mx-auto mt-2 w-48">
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${burnRateData.data.progress * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {Math.round(burnRateData.data.progress * 100)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
