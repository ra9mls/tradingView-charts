"use client";

import { useState, useEffect } from "react";
import { fetchSignals } from "@/lib/graphql";
import type { ApiEndpoint } from "@/types/chart";
import SignalDetailView from "./SignalDetailView";

interface Signal {
  id: string;
  name: string;
  description: string;
  direction: "LONG" | "SHORT";
  token?: {
    icon?: string;
    logoURI?: string;
    name?: string;
    symbol?: string;
    description?: string;
    priceUsd?: string | number;
  };
  lastTrigger?: {
    triggeredAt?: string;
    id?: string;
    price?: string | number;
    roiPrice?: string | number;
    roiBPS?: number;
  };
  stats?: Array<{
    pastROIBPS?: number;
    rr?: string | number;
    timeframe?: string;
    winRateBPS?: number;
    frequency?: number;
  }>;
}

export default function SignalsListView() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState<ApiEndpoint>("staging");
  const [selectedSignalFilter, setSelectedSignalFilter] = useState<"all" | "LONG" | "SHORT">("all");
  const [selectedToken, setSelectedToken] = useState<string>("all");
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  useEffect(() => {
    loadSignals();
  }, [endpoint]);

  const loadSignals = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchSignals(endpoint, {});
      const signalsList = response?.signals?.signals?.signals || [];
      setSignals(signalsList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load signals";
      setError(errorMessage);
      console.error("Error loading signals:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSignals = signals.filter((signal) => {
    if (selectedSignalFilter !== "all" && signal.direction !== selectedSignalFilter) {
      return false;
    }
    return true;
  });

  // Calculate real signal data from API response
  const getSignalData = (signal: Signal) => {
    // Trigger Price from lastTrigger.price
    const triggerPriceRaw = signal.lastTrigger?.price;
    const triggerPrice = typeof triggerPriceRaw === 'string'
      ? parseFloat(triggerPriceRaw)
      : (triggerPriceRaw || 0);

    // Current Price from token.priceUsd
    const currentPriceRaw = signal.token?.priceUsd;
    const currentPrice = typeof currentPriceRaw === 'string'
      ? parseFloat(currentPriceRaw)
      : (currentPriceRaw || 0);

    // Calculate Since Signal percentage
    let sinceSignal = 0;
    if (triggerPrice > 0 && currentPrice > 0) {
      if (signal.direction === "LONG") {
        sinceSignal = ((currentPrice - triggerPrice) / triggerPrice) * 100;
      } else {
        // SHORT: profit when price goes down
        sinceSignal = ((triggerPrice - currentPrice) / triggerPrice) * 100;
      }
    }

    // Calculate time ago from triggeredAt
    let timeAgoText = 'just now';
    if (signal.lastTrigger?.triggeredAt) {
      const triggeredTime = new Date(signal.lastTrigger.triggeredAt).getTime();
      const now = Date.now();
      const diffMs = now - triggeredTime;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays >= 1) {
        timeAgoText = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      } else if (diffHours >= 1) {
        timeAgoText = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      } else if (diffMinutes >= 1) {
        timeAgoText = `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
    }

    // Past ROI from stats.pastROIBPS (divide by 100)
    const pastROI = signal.stats?.[0]?.pastROIBPS ? (signal.stats[0].pastROIBPS / 100) : 0;

    return {
      triggerPrice: triggerPrice > 0 ? `$${triggerPrice.toFixed(triggerPrice < 1 ? 6 : 2)}` : "N/A",
      sinceSignal: sinceSignal,
      pastROI: pastROI,
      timeAgo: timeAgoText,
    };
  };

  const getTokenSymbol = (signal: Signal) => {
    // Use token symbol from API, fallback to extracting from name
    return signal.token?.symbol || signal.name.split(" ")[0];
  };

  const getTokenIcon = (signal: Signal) => {
    // Use token icon from API if available
    return signal.token?.icon || signal.token?.logoURI;
  };

  const handleSignalClick = (signal: Signal) => {
    setSelectedSignalId(signal.id);
    setSelectedSignal(signal);
  };

  const handleBackToList = () => {
    setSelectedSignalId(null);
    setSelectedSignal(null);
  };

  // Show detail view if a signal is selected
  if (selectedSignalId && selectedSignal) {
    return (
      <SignalDetailView
        signalId={selectedSignalId}
        endpoint={endpoint}
        onBack={handleBackToList}
        signalFromList={{
          description: selectedSignal.description,
          direction: selectedSignal.direction,
          stats: selectedSignal.stats,
        }}
      />
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* API Endpoint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Endpoint
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setEndpoint("staging")}
                className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  endpoint === "staging"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Stage
              </button>
              <button
                onClick={() => setEndpoint("sandbox")}
                className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  endpoint === "sandbox"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Sandbox
              </button>
            </div>
          </div>

          {/* Signal Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Signal Type
            </label>
            <select
              value={selectedSignalFilter}
              onChange={(e) => setSelectedSignalFilter(e.target.value as "all" | "LONG" | "SHORT")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Signals</option>
              <option value="LONG">Long</option>
              <option value="SHORT">Short</option>
            </select>
          </div>

          {/* Token Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Token
            </label>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Tokens</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center transition-colors">
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Loading signals...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Signals List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredSignals.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center transition-colors">
              <p className="text-gray-500 dark:text-gray-400">No signals found</p>
            </div>
          ) : (
            filteredSignals.map((signal) => {
              const signalData = getSignalData(signal);
              const tokenSymbol = getTokenSymbol(signal);
              const tokenIcon = getTokenIcon(signal);
              const isLong = signal.direction === "LONG";

              return (
                <div
                  key={signal.id}
                  onClick={() => handleSignalClick(signal)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 transition-colors hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Token Icon */}
                      {tokenIcon ? (
                        <img
                          src={tokenIcon}
                          alt={tokenSymbol}
                          className="w-12 h-12 rounded-full"
                          onError={(e) => {
                            // Fallback to gradient if image fails
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg';
                              fallback.textContent = tokenSymbol.charAt(0);
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {tokenSymbol.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {tokenSymbol}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                          {signal.description}
                        </p>
                      </div>
                    </div>
                    {/* Signal Type Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isLong
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}
                    >
                      {signal.direction === "LONG" ? "Long" : "Short"}
                    </span>
                  </div>

                  {/* Time */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {signalData.timeAgo}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Trigger Price */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Trigger Price
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {signalData.triggerPrice}
                      </p>
                    </div>

                    {/* Since Signal */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Since Signal
                      </p>
                      <p
                        className={`text-lg font-bold flex items-center gap-1 ${
                          signalData.sinceSignal >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {signalData.sinceSignal >= 0 && "▲"}
                        {signalData.sinceSignal < 0 && "▼"}
                        {Math.abs(signalData.sinceSignal).toFixed(2)}%
                      </p>
                    </div>

                    {/* Past ROI */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Past ROI
                      </p>
                      <p
                        className={`text-lg font-bold flex items-center gap-1 ${
                          signalData.pastROI >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {signalData.pastROI >= 0 && "▲"}
                        {signalData.pastROI < 0 && "▼"}
                        {Math.abs(signalData.pastROI).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
}
