export type Interval =
  | "INTERVAL_1D"
  | "INTERVAL_1H"
  | "INTERVAL_1M"
  | "INTERVAL_1W"
  | "INTERVAL_3D"
  | "INTERVAL_4H"
  | "INTERVAL_5M"
  | "INTERVAL_6H";

export interface TokenPriceData {
  timestamp: string;
  closeUSD: number | string; // API returns strings
  openUSD: number | string;  // API returns strings
  highUSD: number | string;  // API returns strings
  lowUSD: number | string;   // API returns strings
  isFinal: boolean;
  __typename: string;
}

export interface PriceHistoryCandles {
  tokenPriceData: TokenPriceData[];
  __typename: string;
}

export interface Performance {
  priceHistoryCandles: PriceHistoryCandles;
  __typename: string;
}

export interface GraphQLResponse {
  performance: Performance;
}

export interface PriceHistoryCandlesInput {
  mint: string;
  chain: "SOLANA";
  interval: Interval;
  from: string;
  to: string;
}

export type ApiEndpoint = "sandbox" | "staging";

export interface Token {
  symbol: string;
  address: string;
  category?: "AI" | "Meme" | "DeFi" | "LST" | "Stablecoin" | "Wrapped" | "Infrastructure" | "Other";
}
