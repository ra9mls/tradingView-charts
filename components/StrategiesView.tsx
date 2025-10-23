"use client";

import { useState, useEffect } from "react";
import TokenSearchModal from "@/components/TokenSearchModal";
import { fetchTokenPriceData } from "@/lib/graphql";
import { getTokenBySymbol } from "@/lib/tokens";
import type { Interval, ApiEndpoint, TokenPriceData, Token } from "@/types/chart";
import StrategyChart from "@/components/StrategyChart";

type TimeRangePreset = "1D" | "7D" | "1M" | "3M" | "1Y" | "custom";
type SignalType = "LONG" | "SHORT";

interface Strategy {
  id: string;
  interval: Interval;
  signal: SignalType;
  data: TokenPriceData[];
  color: string;
  profit: number;
}

export default function StrategiesView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(getTokenBySymbol("cbBTC") || null);
  const [timeRangePreset, setTimeRangePreset] = useState<TimeRangePreset>("1D");
  const [fromDate, setFromDate] = useState("2025-10-14T19:00");
  const [toDate, setToDate] = useState("2025-10-15T19:00");
  const [endpoint, setEndpoint] = useState<ApiEndpoint>("sandbox");
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Strategy inputs
  const [selectedInterval, setSelectedInterval] = useState<Interval>("INTERVAL_1H");
  const [selectedSignal, setSelectedSignal] = useState<SignalType>("LONG");

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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
        return;
    }

    setFromDate(from.toISOString().slice(0, 16));
    setToDate(to);
  };

  const handleAddStrategy = async () => {
    setLoading(true);
    setError(null);

    try {
      const tokenAddress = selectedToken?.address;

      if (!tokenAddress || tokenAddress.trim().length === 0) {
        throw new Error("Please select a token");
      }

      let fromDateTime: Date;
      let toDateTime: Date;

      if (timeRangePreset === "custom") {
        // Custom: use user-selected dates
        if (!fromDate || !toDate) {
          throw new Error("Please select both from and to dates");
        }
        fromDateTime = new Date(fromDate);
        toDateTime = new Date(toDate);
      } else {
        // Preset: use current time for "to" with +1ms precision
        const now = new Date();
        toDateTime = new Date(now.getTime() + 1);

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
            milliseconds = 24 * 60 * 60 * 1000;
        }
        fromDateTime = new Date(toDateTime.getTime() - milliseconds);
      }

      const fromISO = fromDateTime.toISOString();
      const toISO = toDateTime.toISOString();

      const response = await fetchTokenPriceData(endpoint, {
        mint: tokenAddress,
        chain: "SOLANA",
        interval: selectedInterval,
        from: fromISO,
        to: toISO,
      });

      const priceData = response?.performance?.priceHistoryCandles?.tokenPriceData;

      if (!priceData || !Array.isArray(priceData)) {
        throw new Error("Invalid response format from API");
      }

      if (priceData.length === 0) {
        throw new Error("No data available for the selected parameters");
      }

      // Calculate profit/loss
      const firstPrice = typeof priceData[0]?.openUSD === 'string'
        ? parseFloat(priceData[0].openUSD)
        : (priceData[0]?.openUSD || 0);
      const lastItem = priceData[priceData.length - 1];
      const lastPrice = typeof lastItem?.closeUSD === 'string'
        ? parseFloat(lastItem.closeUSD as string)
        : (lastItem?.closeUSD as number || 0);

      let profit: number;
      if (selectedSignal === "LONG") {
        profit = ((lastPrice - firstPrice) / firstPrice) * 100;
      } else {
        // SHORT: profit when price goes down
        profit = ((firstPrice - lastPrice) / firstPrice) * 100;
      }

      // Determine color: green if profit, red if loss
      const color = profit >= 0 ? '#22c55e' : '#ef4444';

      const newStrategy: Strategy = {
        id: Date.now().toString(),
        interval: selectedInterval,
        signal: selectedSignal,
        data: priceData,
        color,
        profit,
      };

      setStrategies([...strategies, newStrategy]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStrategy = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
  };

  const handleClearAll = () => {
    setStrategies([]);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
        {/* Token Selector */}
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
        </div>

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

        {/* Time Range */}
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

        {/* Signal Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Interval
            </label>
            <div className="flex flex-wrap gap-2">
              {intervals.map((int) => (
                <button
                  key={int.value}
                  onClick={() => setSelectedInterval(int.value)}
                  className={`px-3 py-2 rounded-md font-medium text-sm transition-all ${
                    selectedInterval === int.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {int.label}
                </button>
              ))}
            </div>
          </div>

          {/* Signal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Signal Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSignal("LONG")}
                className={`flex-1 px-4 py-3 rounded-md font-medium text-sm transition-all ${
                  selectedSignal === "LONG"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                LONG
              </button>
              <button
                onClick={() => setSelectedSignal("SHORT")}
                className={`flex-1 px-4 py-3 rounded-md font-medium text-sm transition-all ${
                  selectedSignal === "SHORT"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                SHORT
              </button>
            </div>
          </div>
        </div>

        {/* Add Signal Button */}
        <button
          onClick={handleAddStrategy}
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Signal...
            </span>
          ) : (
            "Add Signal"
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Signals List */}
      {strategies.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Active Signals ({strategies.length})
            </h3>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: strategy.color }}
                  ></div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {intervals.find(i => i.value === strategy.interval)?.label}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    strategy.signal === "LONG"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}>
                    {strategy.signal}
                  </span>
                  <span className={`font-semibold ${
                    strategy.profit >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {strategy.profit >= 0 ? "+" : ""}{strategy.profit.toFixed(2)}%
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveStrategy(strategy.id)}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signal Chart */}
      {strategies.length > 0 && (
        <StrategyChart strategies={strategies} isDark={isDark} />
      )}

      {strategies.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center transition-colors">
          <p className="text-gray-500 dark:text-gray-400">
            Add signals to compare their performance
          </p>
        </div>
      )}
    </>
  );
}
