"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import {
  AlertTriangle,
  CheckCircle,
  Minus,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BurnRateArtifact } from "@/lib/ai/artifacts/burn-rate";

interface BurnRateChartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BurnRateChart({ isOpen, onClose }: BurnRateChartProps) {
  const [activeTab, setActiveTab] = useState<"chart" | "insights">("chart");

  // Get data directly from the artifact hook
  const burnRateData = useArtifact(BurnRateArtifact);

  // Extract data with fallbacks
  const title = burnRateData?.data?.title || "Burn Rate Analysis";
  const stage = burnRateData?.data?.stage || "loading";
  const progress = burnRateData?.data?.progress || 0;
  const chartData = burnRateData?.data?.chartData || [];
  const summary = burnRateData?.data?.summary;
  const currency = burnRateData?.data?.currency || "USD";

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format month for display
  const formatMonth = (month: string) => {
    const date = new Date(`${month}-01`);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  // Get trend icon and color
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "declining":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 flex h-[90vh] w-full max-w-6xl flex-col rounded-lg bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {stage === "complete" && summary && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(summary.trend)}
                <span
                  className={`text-sm font-medium ${getTrendColor(summary.trend)}`}
                >
                  {summary.trend}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {stage !== "complete" && (
          <div className="bg-gray-50 px-6 py-3 dark:bg-gray-800">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stage === "loading" && "Initializing..."}
                {stage === "processing" && "Processing data..."}
                {stage === "analyzing" && "Analyzing trends..."}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab("chart")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "chart"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Charts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("insights")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "insights"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Insights
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === "chart" && (
              <div className="space-y-6">
                {/* Burn Rate Chart */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Monthly Burn Rate
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          tickFormatter={formatMonth}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tickFormatter={(value) => formatCurrency(value)}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            formatCurrency(value),
                            name === "burnRate"
                              ? "Burn Rate"
                              : name === "revenue"
                                ? "Revenue"
                                : "Expenses",
                          ]}
                          labelFormatter={(month) => formatMonth(month)}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Revenue"
                        />
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="Expenses"
                        />
                        <Line
                          type="monotone"
                          dataKey="burnRate"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          name="Burn Rate"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Runway Chart */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Runway (Months)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          tickFormatter={formatMonth}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value: number) => [
                            `${value.toFixed(1)} months`,
                            "Runway",
                          ]}
                          labelFormatter={(month) => formatMonth(month)}
                        />
                        <Bar dataKey="runway" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "insights" && summary && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <h4 className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Current Burn Rate
                    </h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(summary.currentBurnRate)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <h4 className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Average Runway
                    </h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summary.averageRunway.toFixed(1)} months
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <h4 className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Trend
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(summary.trend)}
                      <span
                        className={`text-lg font-bold ${getTrendColor(summary.trend)}`}
                      >
                        {summary.trend}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {summary.alerts.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                      <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                      Alerts
                    </h4>
                    <div className="space-y-2">
                      {summary.alerts.map((alert) => (
                        <div
                          key={`alert-${alert.slice(0, 20)}`}
                          className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
                        >
                          <p className="text-sm text-red-800 dark:text-red-200">
                            {alert}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {summary.recommendations.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      Recommendations
                    </h4>
                    <div className="space-y-2">
                      {summary.recommendations.map((recommendation) => (
                        <div
                          key={`recommendation-${recommendation.slice(0, 20)}`}
                          className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
                        >
                          <p className="text-sm text-green-800 dark:text-green-200">
                            {recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
