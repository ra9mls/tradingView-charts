# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd tradingView-charts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Using the Application

### Basic Usage

1. **Enter Token Address**: Paste a Solana token mint address
   - Default: `cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij`

2. **Select API Endpoint**: Choose between Sandbox or Staging
   - Sandbox: `https://gcp-sandbox-gateway.rift.ai/graphql/api`
   - Staging: `https://gcp-staging-gateway.rift.ai/graphql/api`

3. **Choose Interval**: Select time interval for candles
   - 1M (1 minute)
   - 5M (5 minutes)
   - 1H (1 hour)
   - 4H (4 hours)
   - 6H (6 hours)
   - 1D (1 day)
   - 3D (3 days)
   - 1W (1 week)

4. **Set Date Range**:
   - From: Start date and time
   - To: End date and time

5. **Execute**: Click the "Execute" button to fetch and display data

### Example Token Addresses (Solana)

- **cbBTC**: `cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij`
- **SOL**: `So11111111111111111111111111111111111111112`
- **USDC**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

## Project Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Troubleshooting

### Port already in use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

Or run on a different port:
```bash
PORT=3001 npm run dev
```

### GraphQL errors
- Check internet connection
- Verify the token address is valid
- Try switching between Sandbox and Staging endpoints
- Check if the date range contains data for that token

### Chart not displaying
- Ensure there's data in the selected date range
- Check browser console for errors
- Verify the API response contains price data

## Development

### Project Structure

```
tradingview-charts/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   └── TradingViewChart.tsx  # Chart component
├── lib/                   # Utilities
│   └── graphql.ts         # GraphQL client
├── types/                 # TypeScript types
│   └── chart.ts           # Type definitions
└── package.json           # Dependencies
```

### Adding New Features

To add new intervals, edit [types/chart.ts](types/chart.ts):
```typescript
export type Interval =
  | "INTERVAL_1D"
  | "INTERVAL_YOUR_NEW_INTERVAL";
```

Then update the interval list in [app/page.tsx](app/page.tsx).

## Testing with Different Tokens

To test with different Solana tokens:

1. Find token address on Solana explorer
2. Paste into "Token Address" field
3. Select appropriate date range with known trading activity
4. Execute query

## Next Steps

- Deploy to Vercel (see [DEPLOYMENT.md](DEPLOYMENT.md))
- Share with testers
- Customize styling as needed
- Add more features (volume data, indicators, etc.)
