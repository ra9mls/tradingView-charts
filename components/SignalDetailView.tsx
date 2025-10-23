"use client";

import { useState, useEffect, useRef } from "react";
import { fetchSignalDetail, fetchTokenPriceData } from "@/lib/graphql";
import { getTokenBySymbol } from "@/lib/tokens";
import type { ApiEndpoint } from "@/types/chart";
import { createChart, IChartApi, ISeriesApi, LineData, Time } from "lightweight-charts";

interface SignalDetailProps {
  signalId: string;
  endpoint: ApiEndpoint;
  onBack: () => void;
  signalFromList?: {
    description?: string;
    direction?: "LONG" | "SHORT";
    stats?: Array<{
      pastROIBPS?: number;
      rr?: string | number;
      timeframe?: string;
      winRateBPS?: number;
      frequency?: number;
    }>;
  };
}

export default function SignalDetailView({ signalId, endpoint, onBack, signalFromList }: SignalDetailProps) {
  const [signal, setSignal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("ONE_DAY");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRefs = useRef<Map<string, ISeriesApi<"Line">>>(new Map());

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

  useEffect(() => {
    loadSignalDetail();
  }, [signalId, endpoint]);

  const loadSignalDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchSignalDetail(endpoint, signalId);
      const signalData = response?.signals?.signal;

      if (!signalData) {
        throw new Error("Signal not found");
      }

      setSignal(signalData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load signal details";
      setError(errorMessage);
      console.error("Error loading signal details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load chart data for triggers
  useEffect(() => {
    if (!signal || !signal.token?.symbol) return;

    loadChartData();
  }, [signal, selectedTimeframe]);

  const loadChartData = async () => {
    if (!signal) return;

    setLoadingChart(true);

    try {
      // Get token address from symbol
      const tokenSymbol = signal.token?.symbol;
      if (!tokenSymbol) {
        console.error("Token symbol not found");
        setLoadingChart(false);
        return;
      }

      const token = getTokenBySymbol(tokenSymbol);
      if (!token) {
        console.error(`Token with symbol ${tokenSymbol} not found in tokens list`);
        setLoadingChart(false);
        return;
      }

      // Get stats for selected timeframe
      // stats is an array, find the one matching selected timeframe
      const statsArray = Array.isArray(signal.stats) ? signal.stats : [signal.stats];
      const currentStats = statsArray.find(
        (s: any) => s?.timeframe === selectedTimeframe
      ) || statsArray[0];

      if (!currentStats?.lastCompletedTriggers || currentStats.lastCompletedTriggers.length === 0) {
        setChartData([]);
        setLoadingChart(false);
        return;
      }

      // Fetch historical data for each completed trigger
      const triggerDataPromises = currentStats.lastCompletedTriggers.map(async (trigger: any) => {
        const triggeredAt = new Date(trigger.triggeredAt);
        const triggerPrice = typeof trigger.price === 'string' ? parseFloat(trigger.price) : trigger.price;

        // Calculate time period based on timeframe
        let timeRangeMs: number;
        let interval: string;

        if (selectedTimeframe === "ONE_DAY") {
          timeRangeMs = 24 * 60 * 60 * 1000; // 1 day
          interval = "INTERVAL_1H";
        } else if (selectedTimeframe === "ONE_WEEK") {
          timeRangeMs = 7 * 24 * 60 * 60 * 1000; // 1 week
          interval = "INTERVAL_4H";
        } else {
          timeRangeMs = 24 * 60 * 60 * 1000;
          interval = "INTERVAL_1H";
        }

        const fromTime = triggeredAt;
        const toTime = new Date(triggeredAt.getTime() + timeRangeMs + 1); // Add 1ms

        // Fetch price data
        try {
          const priceData = await fetchTokenPriceData(endpoint, {
            mint: token.address,
            chain: "SOLANA",
            interval: interval as any,
            from: fromTime.toISOString(),
            to: toTime.toISOString(),
          });

          const candles = priceData?.performance?.priceHistoryCandles?.tokenPriceData || [];

          if (candles.length === 0) {
            return null;
          }

          // Sort candles by timestamp to ensure ascending order
          const sortedCandles = [...candles].sort((a: any, b: any) => {
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            return timeA - timeB;
          });

          // Use trigger.price as baseline (point 0)
          const basePrice = triggerPrice;

          // Calculate percentage changes starting from (0, 0)
          // Point 0 is trigger.price at trigger moment
          const percentageData: any[] = [
            {
              time: 0 as Time,
              value: 0, // trigger.price compared to itself = 0%
            }
          ];

          // Add candle data with index-based time, starting from 1
          sortedCandles.forEach((candle: any, index: number) => {
            const closePrice = typeof candle.closeUSD === 'string'
              ? parseFloat(candle.closeUSD)
              : candle.closeUSD;

            let percentChange = 0;
            if (basePrice > 0 && closePrice > 0) {
              if (signal.direction === "LONG") {
                percentChange = ((closePrice - basePrice) / basePrice) * 100;
              } else {
                percentChange = ((basePrice - closePrice) / basePrice) * 100;
              }
            }

            percentageData.push({
              time: (index + 1) as Time,
              value: percentChange,
            });
          });

          return {
            triggerId: trigger.id,
            data: percentageData,
            roiBPS: trigger.roiBPS,
          };
        } catch (err) {
          console.error(`Failed to load data for trigger ${trigger.id}:`, err);
          return null;
        }
      });

      const results = await Promise.all(triggerDataPromises);
      const validResults = results.filter((r) => r !== null);

      // Fetch data for lastTrigger (current active trigger) - black line
      let lastTriggerData = null;
      if (signal.lastTrigger?.triggeredAt) {
        try {
          const lastTriggeredAt = new Date(signal.lastTrigger.triggeredAt);
          const lastTriggerPrice = typeof signal.lastTrigger.price === 'string'
            ? parseFloat(signal.lastTrigger.price)
            : signal.lastTrigger.price;
          const now = new Date();
          const nowPlusOne = new Date(now.getTime() + 1); // Add 1ms

          // Calculate time period based on timeframe
          let interval: string;
          if (selectedTimeframe === "ONE_DAY") {
            interval = "INTERVAL_1H";
          } else if (selectedTimeframe === "ONE_WEEK") {
            interval = "INTERVAL_4H";
          } else {
            interval = "INTERVAL_1H";
          }

          // Fetch from lastTrigger time to now
          const priceData = await fetchTokenPriceData(endpoint, {
            mint: token.address,
            chain: "SOLANA",
            interval: interval as any,
            from: lastTriggeredAt.toISOString(),
            to: nowPlusOne.toISOString(),
          });

          const candles = priceData?.performance?.priceHistoryCandles?.tokenPriceData || [];

          if (candles.length > 0) {
            // Sort candles by timestamp to ensure ascending order
            const sortedCandles = [...candles].sort((a: any, b: any) => {
              const timeA = new Date(a.timestamp).getTime();
              const timeB = new Date(b.timestamp).getTime();
              return timeA - timeB;
            });

            // Use lastTrigger.price as baseline (point 0)
            const basePrice = lastTriggerPrice;

            // Calculate percentage changes starting from (0, 0)
            // Point 0 is lastTrigger.price at trigger moment
            const percentageData: any[] = [
              {
                time: 0 as Time,
                value: 0, // lastTrigger.price compared to itself = 0%
              }
            ];

            // Add candle data with index-based time, starting from 1
            sortedCandles.forEach((candle: any, index: number) => {
              const closePrice = typeof candle.closeUSD === 'string'
                ? parseFloat(candle.closeUSD)
                : candle.closeUSD;

              let percentChange = 0;
              if (basePrice > 0 && closePrice > 0) {
                if (signal.direction === "LONG") {
                  percentChange = ((closePrice - basePrice) / basePrice) * 100;
                } else {
                  percentChange = ((basePrice - closePrice) / basePrice) * 100;
                }
              }

              percentageData.push({
                time: (index + 1) as Time,
                value: percentChange,
              });
            });

            lastTriggerData = {
              triggerId: 'last-trigger',
              data: percentageData,
              isLastTrigger: true,
            };
          }
        } catch (err) {
          console.error('Failed to load data for last trigger:', err);
        }
      }

      // Combine completed triggers with last trigger
      const allResults = lastTriggerData
        ? [...validResults, lastTriggerData]
        : validResults;

      setChartData(allResults);
    } catch (err) {
      console.error("Error loading chart data:", err);
    } finally {
      setLoadingChart(false);
    }
  };

  // Create chart
  useEffect(() => {
    if (!chartContainerRef.current || !signal || chartData.length === 0) return;

    // Clean up existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRefs.current.clear();
    }

    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: {
          color: isDark ? "#1f2937" : "#ffffff",
        },
        textColor: isDark ? "#d1d5db" : "#333333",
      },
      grid: {
        vertLines: {
          color: isDark ? "#374151" : "#e0e0e0",
        },
        horzLines: {
          color: isDark ? "#374151" : "#e0e0e0",
        },
      },
      rightPriceScale: {
        borderColor: isDark ? "#4b5563" : "#cccccc",
      },
      timeScale: {
        borderColor: isDark ? "#4b5563" : "#cccccc",
        timeVisible: false,
        visible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    // Find max data length (index)
    let maxDataLength = 0;
    chartData.forEach((triggerData: any) => {
      if (triggerData && triggerData.data) {
        if (triggerData.data.length > maxDataLength) {
          maxDataLength = triggerData.data.length;
        }
      }
    });

    // Calculate min and max across all triggers
    let globalMin = 0;
    let globalMax = 0;

    chartData.forEach((triggerData: any) => {
      if (triggerData && triggerData.data) {
        triggerData.data.forEach((point: any) => {
          if (point.value < globalMin) globalMin = point.value;
          if (point.value > globalMax) globalMax = point.value;
        });
      }
    });

    // Collect all percentage data for average calculation
    const allPercentageData: LineData[][] = [];

    // Add trigger lines
    chartData.forEach((triggerData: any) => {
      if (!triggerData || !triggerData.data || triggerData.data.length === 0) return;

      // Check if this is the last trigger (black line)
      if (triggerData.isLastTrigger) {
        // Draw black line for current active trigger
        const lineSeries = chart.addLineSeries({
          color: "#000000", // Black
          lineWidth: 3,
          priceLineVisible: true,
          lastValueVisible: true,
        });

        lineSeries.setData(triggerData.data);
        seriesRefs.current.set(triggerData.triggerId, lineSeries);
        // Don't include in average calculation
        return;
      }

      // Regular completed trigger lines
      const roiPercent = triggerData.roiBPS ? triggerData.roiBPS / 100 : 0;
      const color = roiPercent >= 0 ? "#22c55e" : "#ef4444";

      const lineSeries = chart.addLineSeries({
        color: color,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      lineSeries.setData(triggerData.data);
      seriesRefs.current.set(triggerData.triggerId, lineSeries);

      // Store data for average calculation (only completed triggers)
      allPercentageData.push(triggerData.data);
    });

    // Calculate and add Historical Average line (blue line)
    if (allPercentageData.length > 1) {
      const averageData: LineData[] = [];

      // Find the maximum length to iterate through all possible indices
      for (let i = 0; i < maxDataLength; i++) {
        let sum = 0;
        let count = 0;

        // Sum all trigger values at this index
        allPercentageData.forEach((triggerData) => {
          if (i < triggerData.length && typeof triggerData[i].value === 'number') {
            sum += triggerData[i].value;
            count++;
          }
        });

        if (count > 0) {
          averageData.push({
            time: i as Time,
            value: sum / count,
          });
        }
      }

      // Add average line series
      if (averageData.length > 0) {
        const averageSeries = chart.addLineSeries({
          color: "#3b82f6", // Blue
          lineWidth: 3,
          title: "Historical Average",
          priceLineVisible: true,
          lastValueVisible: true,
        });

        averageSeries.setData(averageData);
        seriesRefs.current.set("average", averageSeries);
      }
    }

    // Add baseline at 0
    const zeroLineSeries = chart.addLineSeries({
      color: isDark ? "#6b7280" : "#9ca3af",
      lineWidth: 1,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const zeroLineData: LineData[] = [
      { time: 0 as Time, value: 0 },
      { time: (maxDataLength - 1) as Time, value: 0 },
    ];
    zeroLineSeries.setData(zeroLineData);

    // Add MAX line
    const maxLineSeries = chart.addLineSeries({
      color: "#22c55e",
      lineWidth: 1,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const maxLineData: LineData[] = [
      { time: 0 as Time, value: globalMax },
      { time: (maxDataLength - 1) as Time, value: globalMax },
    ];
    maxLineSeries.setData(maxLineData);

    // Add MIN line
    const minLineSeries = chart.addLineSeries({
      color: "#ef4444",
      lineWidth: 1,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const minLineData: LineData[] = [
      { time: 0 as Time, value: globalMin },
      { time: (maxDataLength - 1) as Time, value: globalMin },
    ];
    minLineSeries.setData(minLineData);

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRefs.current.clear();
      }
    };
  }, [signal, isDark, chartData]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center transition-colors">
        <div className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading signal details...</p>
        </div>
      </div>
    );
  }

  if (error || !signal) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-800 dark:text-red-300 text-sm">{error || "Signal not found"}</p>
        </div>
      </div>
    );
  }

  const tokenSymbol = signal.token?.symbol || signal.name.split(" ")[0];
  const tokenIcon = signal.token?.icon || signal.token?.logoURI;
  const tokenName = signal.token?.name || tokenSymbol;
  const isLong = signal.direction === "LONG";
  const lastTrigger = signal.lastTrigger;

  // Get stats for selected timeframe
  const statsArray = Array.isArray(signal.stats) ? signal.stats : [signal.stats];
  const currentStats = statsArray.find(
    (s: any) => s?.timeframe === selectedTimeframe
  ) || statsArray[0];

  // Use currentStats based on selected timeframe for dynamic updates
  const statsToUse = currentStats;

  // Calculate win rate percentage
  const winRate = statsToUse?.winRateBPS ? (statsToUse.winRateBPS / 100).toFixed(0) : "0";
  const rr = statsToUse?.rr
    ? (typeof statsToUse.rr === 'string' ? parseFloat(statsToUse.rr) : statsToUse.rr).toFixed(2)
    : "0.00";
  const pastROI = statsToUse?.pastROIBPS ? (statsToUse.pastROIBPS / 100).toFixed(2) : "0.00";

  // Get timeframe label for display
  const timeframeLabel = selectedTimeframe === "ONE_DAY" ? "1D" : selectedTimeframe === "ONE_WEEK" ? "1W" : "1D";

  // Calculate time ago
  let timeAgoText = '';
  if (lastTrigger?.triggeredAt) {
    const diffMs = Date.now() - new Date(lastTrigger.triggeredAt).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
      timeAgoText = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffHours >= 1) {
      timeAgoText = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMinutes >= 1) {
      timeAgoText = `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      timeAgoText = 'just now';
    }
  }

  // Calculate since last trigger ROI (current price vs trigger price)
  let sinceLastTriggerPercent = 0;
  if (lastTrigger?.price && signal.token?.priceUsd) {
    const triggerPriceRaw = lastTrigger.price;
    const triggerPrice = typeof triggerPriceRaw === 'string'
      ? parseFloat(triggerPriceRaw)
      : triggerPriceRaw;

    const currentPriceRaw = signal.token.priceUsd;
    const currentPrice = typeof currentPriceRaw === 'string'
      ? parseFloat(currentPriceRaw)
      : currentPriceRaw;

    if (triggerPrice > 0 && currentPrice > 0) {
      if (signal.direction === "LONG") {
        sinceLastTriggerPercent = ((currentPrice - triggerPrice) / triggerPrice) * 100;
      } else {
        // SHORT: profit when price goes down
        sinceLastTriggerPercent = ((triggerPrice - currentPrice) / triggerPrice) * 100;
      }
    }
  }
  const sinceLastTrigger = sinceLastTriggerPercent.toFixed(2);

  return (
    <>
      {/* Back Button with Title */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {signalFromList?.description && (
          <div className="flex items-center gap-2 flex-1 justify-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {signalFromList.description} ({signalFromList.direction || signal?.direction})
            </h1>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Token Icon */}
            {tokenIcon ? (
              <img
                src={tokenIcon}
                alt={tokenSymbol}
                className="w-14 h-14 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl';
                    fallback.textContent = tokenSymbol.charAt(0);
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {tokenSymbol.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {tokenName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tokenSymbol}</p>
            </div>
          </div>
          {/* Signal Type Badge */}
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isLong
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            }`}
          >
            {signal.direction === "LONG" ? "Long" : "Short"}
          </span>
        </div>

        {/* Last Trigger Info */}
        {lastTrigger && (
          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
            {signal.direction === "LONG" ? "Long" : "Short"} signal triggered {timeAgoText} at ${typeof lastTrigger.price === 'string' ? lastTrigger.price : lastTrigger.price?.toFixed(lastTrigger.price < 1 ? 6 : 2)}
          </p>
        )}
      </div>

      {/* Past Performance Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Past Performance (ROI)
          </h3>
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Historical Average ({timeframeLabel})
              </span>
            </div>
            <span className={`text-sm font-semibold ${
              parseFloat(pastROI) >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {parseFloat(pastROI) >= 0 && "▲ "}
              {parseFloat(pastROI) < 0 && "▼ "}
              {Math.abs(parseFloat(pastROI))}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-black dark:bg-white"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Current Trigger
              </span>
            </div>
            <span className={`text-sm font-semibold ${
              parseFloat(sinceLastTrigger) >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {parseFloat(sinceLastTrigger) >= 0 && "▲ "}
              {parseFloat(sinceLastTrigger) < 0 && "▼ "}
              {Math.abs(parseFloat(sinceLastTrigger))}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6 transition-colors">
        <div className="relative">
          {/* MAX/MIN Labels */}
          {chartData.length > 0 && (() => {
            let globalMin = 0;
            let globalMax = 0;

            chartData.forEach((triggerData: any) => {
              if (triggerData && triggerData.data) {
                triggerData.data.forEach((point: any) => {
                  if (point.value < globalMin) globalMin = point.value;
                  if (point.value > globalMax) globalMax = point.value;
                });
              }
            });

            return (
              <>
                <div className="absolute top-2 right-2 z-10 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  Max: {globalMax.toFixed(2)}%
                </div>
                <div className="absolute bottom-2 right-2 z-10 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  Min: {globalMin.toFixed(2)}%
                </div>
              </>
            );
          })()}

          <div ref={chartContainerRef} className="w-full" />
        </div>

        {/* Timeframe Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setSelectedTimeframe("ONE_DAY")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedTimeframe === "ONE_DAY"
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            1D
          </button>
          {/* Show 1W button if ONE_WEEK timeframe exists in stats */}
          {(() => {
            const statsArray = Array.isArray(signal?.stats) ? signal.stats : [signal?.stats];
            return statsArray.some((s: any) => s?.timeframe === "ONE_WEEK");
          })() && (
            <button
              onClick={() => setSelectedTimeframe("ONE_WEEK")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedTimeframe === "ONE_WEEK"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              1W
            </button>
          )}
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-6 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Key Stats ({timeframeLabel})
          </h3>
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Win Rate */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {winRate}%
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <span>Win Rate</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* R:R */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {rr}x
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <span>R:R</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Past ROI */}
          <div className="text-center">
            <div className={`text-3xl font-bold mb-1 ${
              parseFloat(pastROI) >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {parseFloat(pastROI) >= 0 && "+"}
              {pastROI}%
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <span>Past ROI</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Statistics represent trades executed the previous 10 times the market signal triggered for this token. Past performance does not guarantee future results.
        </p>
      </div>

      {/* Trigger History */}
      {(() => {
        // Get stats for selected timeframe
        const statsArray = Array.isArray(signal?.stats) ? signal.stats : [signal?.stats];
        const currentStats = statsArray.find(
          (s: any) => s?.timeframe === selectedTimeframe
        ) || statsArray[0];

        if (!currentStats?.lastCompletedTriggers || currentStats.lastCompletedTriggers.length === 0) {
          return null;
        }

        const timeframeLabel = selectedTimeframe === "ONE_DAY" ? "1D" : selectedTimeframe === "ONE_WEEK" ? "1W" : "1D";

        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Trigger Date
              </h3>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {timeframeLabel} Performance
              </h3>
            </div>

            <div className="space-y-3">
              {currentStats.lastCompletedTriggers.map((trigger: any) => {
                const triggerDate = new Date(trigger.triggeredAt);
                const roiPercent = trigger.roiBPS ? (trigger.roiBPS / 100).toFixed(2) : "0.00";

                return (
                  <div key={trigger.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {triggerDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className={`font-semibold ${
                      parseFloat(roiPercent) >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {parseFloat(roiPercent) >= 0 && "+"}
                      {roiPercent}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Trigger Frequency */}
            {currentStats.frequency && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Trigger Frequency
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {currentStats.frequency} hours
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Sell Button */}
      <button className="w-full mt-6 px-6 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-colors text-lg shadow-lg">
        Sell
      </button>
    </>
  );
}
