"use client";

import { useState } from "react";
import TradingViewChart, { type ChartType } from "@/components/TradingViewChart";
import TokenSearchModal from "@/components/TokenSearchModal";
import ThemeToggle from "@/components/ThemeToggle";
import { fetchTokenPriceData } from "@/lib/graphql";
import { getTokenBySymbol } from "@/lib/tokens";
import type { Interval, ApiEndpoint, TokenPriceData, Token } from "@/types/chart";

type TimeRangePreset = "1D" | "7D" | "1M" | "3M" | "1Y" | "custom";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(getTokenBySymbol("cbBTC") || null);
  const [interval, setInterval] = useState<Interval>("INTERVAL_1H");
  const [timeRangePreset, setTimeRangePreset] = useState<TimeRangePreset>("1D");
  const [fromDate, setFromDate] = useState("2025-10-14T19:00");
  const [toDate, setToDate] = useState("2025-10-15T19:00");
  const [endpoint, setEndpoint] = useState<ApiEndpoint>("sandbox");
  const [chartData, setChartData] = useState<TokenPriceData[]>([]);
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsModalOpen(false);
  };

  const intervals: { value: Interval; label: string }[] = [
    { value: "INTERVAL_1M", label: "1m" },
    { value: "INTERVAL_5M", label: "5m" },
    { value: "INTERVAL_1H", label: "1h" },
    { value: "INTERVAL_4H", label: "4h" },
    { value: "INTERVAL_6H", label: "6h" },
    { value: "INTERVAL_1D", label: "1D" },
    { value: "INTERVAL_3D", label: "3D" },
    { value: "INTERVAL_1W", label: "1W" },
  ];

  const timeRangePresets: { value: TimeRangePreset; label: string }[] = [
    { value: "1D", label: "1D" },
    { value: "7D", label: "7D" },
    { value: "1M", label: "1M" },
    { value: "3M", label: "3M" },
    { value: "1Y", label: "1Y" },
    { value: "custom", label: "Custom" },
  ];

  // Set time range based on preset
  const handleTimeRangePreset = (preset: TimeRangePreset) => {
    setTimeRangePreset(preset);
    const now = new Date();
    const to = now.toISOString().slice(0, 16);

    let from: Date;
    switch (preset) {
      case "1D":
        from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7D":
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "1M":
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "3M":
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1Y":
        from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return; // Custom - don't change dates
    }

    setFromDate(from.toISOString().slice(0, 16));
    setToDate(to);
  };

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setChartData([]); // Clear previous data

    try {
      const tokenAddress = selectedToken?.address;

      // Validate inputs
      if (!tokenAddress || tokenAddress.trim().length === 0) {
        throw new Error("Please select a token");
      }

      // Use current time for "to" with +1ms precision
      const now = new Date();
      const toDateTime = new Date(now.getTime() + 1); // Current time + 1ms

      // Calculate "from" based on preset or use custom date
      let fromDateTime: Date;

      if (timeRangePreset === "custom") {
        if (!fromDate || !toDate) {
          throw new Error("Please select both from and to dates");
        }
        fromDateTime = new Date(fromDate);
      } else {
        // Calculate from based on preset from current time
        let milliseconds: number;
        switch (timeRangePreset) {
          case "1D":
            milliseconds = 24 * 60 * 60 * 1000;
            break;
          case "7D":
            milliseconds = 7 * 24 * 60 * 60 * 1000;
            break;
          case "1M":
            milliseconds = 30 * 24 * 60 * 60 * 1000;
            break;
          case "3M":
            milliseconds = 90 * 24 * 60 * 60 * 1000;
            break;
          case "1Y":
            milliseconds = 365 * 24 * 60 * 60 * 1000;
            break;
          default:
            milliseconds = 24 * 60 * 60 * 1000; // Default to 1D
        }
        fromDateTime = new Date(now.getTime() - milliseconds);
      }

      const fromISO = fromDateTime.toISOString();
      const toISO = toDateTime.toISOString();

      // Check date order
      if (fromDateTime >= toDateTime) {
        throw new Error("From date must be before To date");
      }

      console.log("Fetching data with params:", {
        mint: tokenAddress,
        chain: "SOLANA",
        interval,
        from: fromISO,
        to: toISO,
        endpoint,
      });

      const response = await fetchTokenPriceData(endpoint, {
        mint: tokenAddress,
        chain: "SOLANA",
        interval,
        from: fromISO,
        to: toISO,
      });

      console.log("Response received:", response);

      const priceData = response?.performance?.priceHistoryCandles?.tokenPriceData;

      if (!priceData || !Array.isArray(priceData)) {
        throw new Error("Invalid response format from API");
      }

      if (priceData.length === 0) {
        throw new Error("No data available for the selected parameters. Try a different date range or token.");
      }

      console.log(`Received ${priceData.length} data points`);
      setChartData(priceData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data. Please check your inputs and try again.";
      setError(errorMessage);
      console.error("Error fetching data:", err);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Solana Token Price Chart</h1>
          <ThemeToggle />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
          {/* Token Selector - Modal Style */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Token
            </label>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full px-4 py-3 text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-700"
            >
              {selectedToken ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedToken.symbol}</span>
                    {selectedToken.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                        {selectedToken.category}
                      </span>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Choose a token...</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </button>
            {selectedToken && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                {selectedToken.address}
              </div>
            )}
          </div>

          {/* Token Search Modal */}
          <TokenSearchModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelectToken={handleTokenSelect}
            currentToken={selectedToken?.symbol || ""}
          />

          {/* API Endpoint */}
          <div className="mb-6">
            <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Endpoint
            </label>
            <select
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value as ApiEndpoint)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="sandbox">Sandbox</option>
              <option value="staging">Staging</option>
            </select>
          </div>

          {/* Time Range Presets - TradingView Style */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Time Range
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {timeRangePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleTimeRangePreset(preset.value)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    timeRangePreset === preset.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Date Inputs - Show when Custom is selected */}
            {timeRangePreset === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div>
                  <label htmlFor="fromDate" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    From
                  </label>
                  <input
                    id="fromDate"
                    type="datetime-local"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="toDate" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    To
                  </label>
                  <input
                    id="toDate"
                    type="datetime-local"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interval Selector - TradingView Style */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Interval
            </label>
            <div className="flex flex-wrap gap-2">
              {intervals.map((int) => (
                <button
                  key={int.value}
                  onClick={() => setInterval(int.value)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    interval === int.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {int.label}
                </button>
              ))}
            </div>
          </div>

          {/* Execute Button */}
          <button
            onClick={handleExecute}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Chart...
              </span>
            ) : (
              "Load Chart"
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (() => {
          // Calculate price change percentage
          const firstPriceRaw = chartData[0]?.openUSD;
          const firstPrice = typeof firstPriceRaw === 'string'
            ? parseFloat(firstPriceRaw)
            : (firstPriceRaw || 0);

          const lastPriceRaw = chartData[chartData.length - 1]?.closeUSD;
          const lastPrice = typeof lastPriceRaw === 'string'
            ? parseFloat(lastPriceRaw)
            : (lastPriceRaw || 0);

          const priceChange = lastPrice - firstPrice;
          const priceChangePercent = firstPrice > 0 ? ((priceChange / firstPrice) * 100) : 0;
          const isPositive = priceChange >= 0;

          return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Price Chart</h2>
                  {selectedToken && (
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${lastPrice.toFixed(lastPrice < 1 ? 6 : 2)}
                      </span>
                      <span className={`text-lg font-semibold flex items-center ${
                        isPositive
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {isPositive ? '↑' : '↓'} {Math.abs(priceChangePercent).toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {chartData.length} candles
                  </div>
                  {selectedToken && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {isPositive ? '+' : ''}{priceChange.toFixed(lastPrice < 1 ? 6 : 2)} USD
                    </div>
                  )}
                </div>
              </div>
              <TradingViewChart
                data={chartData}
                chartType={chartType}
                onChartTypeChange={setChartType}
              />
            </div>
          );
        })()}

        {/* No Data Message */}
        {!loading && chartData.length === 0 && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-400">Enter token details and click Execute to view the chart</p>
          </div>
        )}
      </div>
    </main>
  );
}
