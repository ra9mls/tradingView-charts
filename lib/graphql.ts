import { GraphQLClient } from "graphql-request";
import type { ApiEndpoint, PriceHistoryCandlesInput, GraphQLResponse } from "@/types/chart";

const ENDPOINTS = {
  sandbox: "https://gcp-sandbox-gateway.rift.ai/graphql/api",
  staging: "https://gcp-staging-gateway.rift.ai/graphql/api",
};

const QUERY = `
  query TokenPriceData($input: PriceHistoryCandlesInput!) {
    performance {
      priceHistoryCandles(input: $input) {
        tokenPriceData {
          timestamp
          closeUSD
          openUSD
          highUSD
          lowUSD
          closeUSD
          isFinal
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export async function fetchTokenPriceData(
  endpoint: ApiEndpoint,
  input: PriceHistoryCandlesInput
): Promise<GraphQLResponse> {
  try {
    const client = new GraphQLClient(ENDPOINTS[endpoint], {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await client.request<GraphQLResponse>(QUERY, { input });

    if (!data) {
      throw new Error("Empty response from API");
    }

    return data;
  } catch (error: any) {
    console.error("GraphQL Error:", error);

    // Handle specific GraphQL errors
    if (error.response?.errors) {
      const errorMessages = error.response.errors
        .map((err: any) => err.message)
        .join(", ");
      throw new Error(`API Error: ${errorMessages}`);
    }

    // Handle network errors
    if (error.message.includes("fetch")) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw new Error(error.message || "Failed to fetch data from API");
  }
}
