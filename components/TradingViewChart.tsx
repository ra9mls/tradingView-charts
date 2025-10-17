"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData } from "lightweight-charts";
import type { TokenPriceData } from "@/types/chart";

export type ChartType = "candlestick" | "line";

interface TradingViewChartProps {
  data: TokenPriceData[];
  chartType?: ChartType;
  onChartTypeChange?: (type: ChartType) => void;
}

export default function TradingViewChart({ data, chartType = "candlestick", onChartTypeChange }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | ISeriesApi<"Line"> | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Dark theme colors
    const darkTheme = {
      background: "#1f2937",
      textColor: "#d1d5db",
      gridColor: "#374151",
      borderColor: "#4b5563",
    };

    // Light theme colors
    const lightTheme = {
      background: "#ffffff",
      textColor: "#333333",
      gridColor: "#e0e0e0",
      borderColor: "#cccccc",
    };

    const theme = isDark ? darkTheme : lightTheme;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 600,
      layout: {
        background: { color: theme.background },
        textColor: theme.textColor,
      },
      grid: {
        vertLines: { color: theme.gridColor },
        horzLines: { color: theme.gridColor },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: theme.borderColor,
      },
      timeScale: {
        borderColor: theme.borderColor,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add series based on chart type
    if (chartType === "candlestick") {
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });
      seriesRef.current = candlestickSeries as any;
    } else {
      const lineSeries = chart.addLineSeries({
        color: "#2563eb",
        lineWidth: 2,
      });
      seriesRef.current = lineSeries as any;
    }

    // Handle resize
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
      chart.remove();
    };
  }, [isDark, chartType]);

  useEffect(() => {
    if (!seriesRef.current || !data.length) return;

    try {
      console.log("Processing chart data:", data.length, "items");
      console.log("First item:", data[0]);
      console.log("Current theme:", isDark ? "dark" : "light");
      console.log("Chart type:", chartType);

      // Transform data
      const transformedData = data
        .map((item) => {
          // Convert string values to numbers (API returns strings)
          const open = typeof item.openUSD === "string" ? parseFloat(item.openUSD) : item.openUSD;
          const high = typeof item.highUSD === "string" ? parseFloat(item.highUSD) : item.highUSD;
          const low = typeof item.lowUSD === "string" ? parseFloat(item.lowUSD) : item.lowUSD;
          const close = typeof item.closeUSD === "string" ? parseFloat(item.closeUSD) : item.closeUSD;

          return {
            timestamp: item.timestamp,
            open,
            high,
            low,
            close,
          };
        })
        .filter((item) => {
          // Filter out invalid data after conversion
          const isValid =
            item.timestamp &&
            !isNaN(item.open) &&
            !isNaN(item.high) &&
            !isNaN(item.low) &&
            !isNaN(item.close) &&
            item.open > 0 &&
            item.high > 0 &&
            item.low > 0 &&
            item.close > 0;

          if (!isValid) {
            console.warn("Invalid data point:", item);
          }

          return isValid;
        })
        .map((item) => ({
          time: Math.floor(new Date(item.timestamp).getTime() / 1000) as any,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }))
        .sort((a, b) => a.time - b.time); // Sort by time ascending

      console.log("Processed data:", transformedData.length, "items");
      console.log("First item:", transformedData[0]);
      console.log("Last item:", transformedData[transformedData.length - 1]);

      if (transformedData.length === 0) {
        console.warn("No valid data to display");
        return;
      }

      // Find max and min prices
      let maxPrice = -Infinity;
      let minPrice = Infinity;
      let maxTime: any = null;
      let minTime: any = null;

      transformedData.forEach((item) => {
        if (item.high > maxPrice) {
          maxPrice = item.high;
          maxTime = item.time;
        }
        if (item.low < minPrice) {
          minPrice = item.low;
          minTime = item.time;
        }
      });

      // Set data based on chart type
      if (chartType === "candlestick") {
        (seriesRef.current as ISeriesApi<"Candlestick">).setData(transformedData as CandlestickData[]);
      } else {
        // For line chart, use close price
        const lineData: LineData[] = transformedData.map((item) => ({
          time: item.time,
          value: item.close,
        }));
        (seriesRef.current as ISeriesApi<"Line">).setData(lineData);
      }

      // Add price markers for max and min
      if (seriesRef.current && maxTime && minTime) {
        seriesRef.current.setMarkers([
          {
            time: maxTime,
            position: 'aboveBar',
            color: '#22c55e',
            shape: 'arrowDown',
            text: `H: ${maxPrice.toFixed(maxPrice < 1 ? 6 : 2)}`,
          },
          {
            time: minTime,
            position: 'belowBar',
            color: '#ef4444',
            shape: 'arrowUp',
            text: `L: ${minPrice.toFixed(minPrice < 1 ? 6 : 2)}`,
          },
        ]);
      }

      console.log("Chart data set successfully");
      console.log(`Max price: ${maxPrice} at ${maxTime}, Min price: ${minPrice} at ${minTime}`);

      // Fit content
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
        console.log("Chart fitted to content");
      }
    } catch (error) {
      console.error("Error setting chart data:", error);
    }
  }, [data, isDark, chartType]); // Re-run when theme or chart type changes

  return (
    <div className="w-full">
      {/* Chart Type Toggle */}
      {onChartTypeChange && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onChartTypeChange("candlestick")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              chartType === "candlestick"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12v8m4-16v16m4-8v8m4-4v4" />
            </svg>
            Candlestick
          </button>
          <button
            onClick={() => onChartTypeChange("line")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              chartType === "line"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Line
          </button>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
