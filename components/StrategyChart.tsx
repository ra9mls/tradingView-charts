"use client";

import { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, LineData } from "lightweight-charts";
import { TokenPriceData } from "@/types/chart";

type SignalType = "LONG" | "SHORT";

interface Strategy {
  id: string;
  interval: string;
  signal: SignalType;
  data: TokenPriceData[];
  color: string;
  profit: number;
}

interface StrategyChartProps {
  strategies: Strategy[];
  isDark?: boolean;
}

export default function StrategyChart({ strategies, isDark = false }: StrategyChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRefs = useRef<Map<string, ISeriesApi<"Line">>>(new Map());

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRefs.current.clear();
    }

    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 600,
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
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

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
  }, [isDark]);

  useEffect(() => {
    if (!chartRef.current || strategies.length === 0) return;

    // Clear existing series
    seriesRefs.current.forEach((series) => {
      chartRef.current?.removeSeries(series);
    });
    seriesRefs.current.clear();

    // Calculate percentage changes for each strategy (starting from point (0,0))
    const allPercentageData: LineData[][] = [];
    // +1 for the initial (0,0) point we add to each strategy
    const maxDataLength = Math.max(...strategies.map(s => (s.data?.length || 0) + 1));

    strategies.forEach((strategy, strategyIndex) => {
      if (!strategy.data || strategy.data.length === 0) return;

      // Get first price for baseline
      const firstPriceRaw = strategy.data[0]?.openUSD;
      const firstPrice = typeof firstPriceRaw === 'string'
        ? parseFloat(firstPriceRaw)
        : (firstPriceRaw || 0);

      if (firstPrice === 0) return;

      // Transform data to percentage changes from Y=0
      // Use index-based X axis so all start from (0, 0)
      const percentageData: LineData[] = [
        // Add initial point at (0, 0) - signal trigger moment
        {
          time: 0 as any,
          value: 0,
        },
        // Then add all data points starting from index 1
        ...strategy.data.map((item, index) => {
          const closeRaw = item.closeUSD;
          const closePrice = typeof closeRaw === 'string'
            ? parseFloat(closeRaw)
            : (closeRaw || 0);

          let percentChange: number;
          if (strategy.signal === "LONG") {
            // LONG: profit when price increases
            percentChange = ((closePrice - firstPrice) / firstPrice) * 100;
          } else {
            // SHORT: profit when price decreases (invert)
            percentChange = ((firstPrice - closePrice) / firstPrice) * 100;
          }

          // Use index + 1 as time (since 0 is the initial point)
          return {
            time: (index + 1) as any,
            value: percentChange,
          };
        })
      ];

      allPercentageData.push(percentageData);

      // Create line series for this strategy
      const lineSeries = chartRef.current!.addLineSeries({
        color: strategy.color,
        lineWidth: 2,
        title: `${strategy.interval} ${strategy.signal}`,
        priceLineVisible: false,
      });

      lineSeries.setData(percentageData);
      seriesRefs.current.set(strategy.id, lineSeries);
    });

    // Calculate historical average (blue line)
    if (allPercentageData.length > 1) {
      const averageData: LineData[] = [];

      // Find the maximum length to iterate through all possible indices
      for (let i = 0; i < maxDataLength; i++) {
        let sum = 0;
        let count = 0;

        // Sum all strategy values at this index
        allPercentageData.forEach((strategyData) => {
          if (i < strategyData.length && typeof strategyData[i].value === 'number') {
            sum += strategyData[i].value;
            count++;
          }
        });

        if (count > 0) {
          averageData.push({
            time: i as any,
            value: sum / count,
          });
        }
      }

      // Add average line
      if (averageData.length > 0) {
        const averageSeries = chartRef.current!.addLineSeries({
          color: "#3b82f6", // Blue
          lineWidth: 3,
          title: "Average",
          priceLineVisible: true,
          lastValueVisible: true,
        });

        averageSeries.setData(averageData);
        seriesRefs.current.set("average", averageSeries);
      }
    }

    // Add horizontal line at Y=0
    const zeroLineSeries = chartRef.current!.addLineSeries({
      color: isDark ? "#6b7280" : "#9ca3af",
      lineWidth: 1,
      lineStyle: 2, // Dashed
      title: "Baseline (0%)",
      priceLineVisible: false,
      lastValueVisible: false,
    });

    if (maxDataLength > 0) {
      const zeroLineData: LineData[] = [
        { time: 0 as any, value: 0 },
        { time: (maxDataLength - 1) as any, value: 0 },
      ];
      zeroLineSeries.setData(zeroLineData);
    }

    // Fit content
    chartRef.current.timeScale().fitContent();

  }, [strategies, isDark]);

  if (strategies.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No signals added yet. Add a signal to see the comparison chart.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Signal Comparison
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All signals start from point (0, 0). Percentage change from signal trigger.
        </p>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
