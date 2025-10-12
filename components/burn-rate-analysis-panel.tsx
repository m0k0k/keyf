"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import { BarChart3 } from "lucide-react";
import { BurnRateArtifact } from "@/lib/ai/artifacts/burn-rate";

export function BurnRateAnalysisPanel() {
  const burnRateData = useArtifact(BurnRateArtifact);

  const hasAnalysisData =
    burnRateData?.data && burnRateData.data.stage === "complete";

  if (!burnRateData?.data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold">Monthly Burn Rate Trend</h3>
        <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <BarChart3 className="mx-auto mb-2 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">Interactive chart will appear here</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Current Monthly Burn
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            $
            {burnRateData.data.summary?.currentBurnRate?.toLocaleString() ||
              "0"}
          </div>
          <div className="text-sm text-green-600">+12.1% vs last month</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">Runway</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {burnRateData.data.summary?.averageRunway || 0} months
          </div>
          <div className="text-sm text-orange-600">Below 6 month threshold</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Average Monthly Burn
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            $
            {burnRateData.data.summary?.currentBurnRate?.toLocaleString() ||
              "0"}
          </div>
          <div className="text-sm text-gray-500">Over last 6 months</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Cash Position
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            $0
          </div>
          <div className="text-sm text-blue-600">Current balance</div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <h4 className="mb-2 font-semibold">Summary</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {burnRateData.data.summary?.alerts?.join(". ") ||
            "Analysis summary will appear here..."}
        </p>
      </div>

      {/* Action Buttons */}
      {hasAnalysisData && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="flex space-x-2">
            <button
              type="button"
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Show revenue breakdown
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Analyze profit margins
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Compare to last quarter
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Generate growth strategy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
