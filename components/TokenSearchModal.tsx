"use client";

import { useState, useEffect, useRef } from "react";
import { searchTokens, getTokensByCategory, type Token } from "@/lib/tokens";

interface TokenSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
  currentToken?: string;
}

export default function TokenSearchModal({
  isOpen,
  onClose,
  onSelectToken,
  currentToken,
}: TokenSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAddress, setCustomAddress] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = ["All", "Meme", "AI", "DeFi", "LST", "Stablecoin", "Wrapped", "Infrastructure"];

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    let tokens = searchTokens(searchQuery);

    if (selectedCategory !== "All") {
      tokens = tokens.filter((t) => t.category === selectedCategory);
    }

    setFilteredTokens(tokens.slice(0, 50)); // Limit to 50 results
  }, [searchQuery, selectedCategory]);

  const handleSelect = (token: Token) => {
    onSelectToken(token);
    onClose();
    setSearchQuery("");
    setShowCustomInput(false);
    setCustomAddress("");
  };

  const handleCustomSubmit = () => {
    if (customAddress.trim().length > 0) {
      const customToken: Token = {
        symbol: "CUSTOM",
        address: customAddress.trim(),
        category: "Other",
      };
      onSelectToken(customToken);
      setCustomAddress("");
      setShowCustomInput(false);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50 dark:bg-opacity-70"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[700px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select Token</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  showCustomInput
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                title="Enter custom token address"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Custom
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Custom Address Input */}
          {showCustomInput && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Token Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="Paste Solana token address..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCustomSubmit();
                    }
                  }}
                />
                <button
                  onClick={handleCustomSubmit}
                  disabled={customAddress.trim().length === 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by symbol or address..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto" style={{ height: '325px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 h-10 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No tokens found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleSelect(token)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentToken === token.symbol
                      ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {token.symbol}
                        </span>
                        {token.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {token.category}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1 truncate">
                        {token.address}
                      </div>
                    </div>
                    {currentToken === token.symbol && (
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
          {filteredTokens.length} tokens {selectedCategory !== "All" && `in ${selectedCategory}`}
        </div>
      </div>
    </div>
  );
}
