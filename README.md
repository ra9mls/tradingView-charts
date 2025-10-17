# Solana Token Price Chart

Web application for fetching and displaying Solana token price data as TradingView-style OHLC candlestick charts.

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 3 steps
- **[TOKEN_SELECTOR.md](TOKEN_SELECTOR.md)** - Token selector with 30+ popular tokens (v1.1.0)
- **[UI_IMPROVEMENTS.md](UI_IMPROVEMENTS.md)** - TradingView-style UI (v1.1.0)
- **[SETUP.md](SETUP.md)** - Detailed setup and usage guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Vercel deployment instructions
- **[FEATURES.md](FEATURES.md)** - Complete feature documentation
- **[TESTING.md](TESTING.md)** - Testing checklist for QA
- **[TEST_EXAMPLES.md](TEST_EXAMPLES.md)** - Test examples with sample data
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Troubleshooting guide (RU/EN)
- **[BUGFIX_SUMMARY.md](BUGFIX_SUMMARY.md)** - String to number conversion fix (v1.0.2)
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Comprehensive project overview

## Features

- Token address input for Solana network
- GraphQL API endpoint selector (Sandbox/Staging)
- Interval selector (1M, 5M, 1H, 4H, 6H, 1D, 3D, 1W)
- Date range picker for historical data
- Interactive TradingView candlestick chart
- Responsive design with Tailwind CSS

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lightweight Charts** - TradingView charting library
- **graphql-request** - GraphQL client

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure the build settings
6. Click "Deploy"

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." > "Project"
3. Import your Git repository or drag and drop your project folder
4. Click "Deploy"

## API Endpoints

- **Sandbox**: https://gcp-sandbox-gateway.rift.ai/graphql/api
- **Staging**: https://gcp-staging-gateway.rift.ai/graphql/api

## GraphQL Query

```graphql
query TokenPriceData($input: PriceHistoryCandlesInput!) {
  performance {
    priceHistoryCandles(input: $input) {
      tokenPriceData {
        timestamp
        closeUSD
        openUSD
        highUSD
        lowUSD
        isFinal
        __typename
      }
      __typename
    }
    __typename
  }
}
```

## Example Variables

```json
{
  "input": {
    "mint": "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij",
    "chain": "SOLANA",
    "interval": "INTERVAL_1H",
    "from": "2025-10-14T19:00:00.000Z",
    "to": "2025-10-15T19:00:00.001Z"
  }
}
```

## Usage

1. Enter a Solana token address (mint)
2. Select an API endpoint (Sandbox or Staging)
3. Choose an interval (1M, 5M, 1H, 4H, 6H, 1D, 3D, 1W)
4. Select date range using the datetime pickers
5. Click "Execute" to fetch and display the chart

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with form and chart
│   └── globals.css         # Global styles
├── components/
│   └── TradingViewChart.tsx # Chart component
├── lib/
│   └── graphql.ts          # GraphQL client and queries
├── types/
│   └── chart.ts            # TypeScript types
└── package.json            # Dependencies
```
