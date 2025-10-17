# Application Features

## Overview

This web application provides a professional interface for viewing Solana token price data as interactive TradingView-style candlestick charts.

## Key Features

### 1. Token Input
- **Clean text input** for Solana token mint addresses
- Pre-filled with example token address
- Supports any valid Solana token

### 2. API Endpoint Selector
- **Dropdown selector** to choose between two environments:
  - **Sandbox**: Testing environment
  - **Staging**: Pre-production environment
- Easy switching between endpoints without code changes

### 3. Time Interval Selection
- **8 interval options**:
  - `1M` - 1 Minute candles
  - `5M` - 5 Minute candles
  - `1H` - 1 Hour candles
  - `4H` - 4 Hour candles
  - `6H` - 6 Hour candles
  - `1D` - 1 Day candles
  - `3D` - 3 Day candles
  - `1W` - 1 Week candles

### 4. Date Range Picker
- **From Date**: Select start date and time
- **To Date**: Select end date and time
- Native browser datetime picker for best UX
- Automatic ISO 8601 format conversion for API

### 5. Interactive Chart
- **TradingView Lightweight Charts** library
- Professional candlestick (OHLC) visualization
- Features:
  - Pan and zoom
  - Crosshair with price/time tooltip
  - Auto-scaling
  - Responsive design
  - Green candles for price increases
  - Red candles for price decreases

### 6. Execute Button
- Large, prominent button to fetch data
- Loading state with spinner
- Disabled during data fetch
- Clear visual feedback

### 7. Error Handling
- **User-friendly error messages**
- Network error handling
- Invalid data handling
- API error display

### 8. Data Display
- Shows number of candles loaded
- Clean, organized layout
- Responsive grid design

## UI/UX Highlights

### Design System
- **Tailwind CSS** for consistent styling
- Clean, modern interface
- Professional color scheme:
  - White backgrounds
  - Gray scale for text and borders
  - Blue accent for interactive elements
  - Red for errors
  - Green/Red for chart candles

### Responsive Layout
- **Mobile-friendly** design
- Grid layout adapts to screen size:
  - 2 columns on desktop
  - 1 column on mobile
- Touch-friendly controls

### Loading States
- Button shows "Loading..." during fetch
- Prevents double submissions
- Clear visual feedback

### Empty States
- Helpful placeholder when no data
- Guides user on what to do next

## Technical Features

### Performance
- **Optimized bundle size**
  - First Load JS: ~166 kB
  - Route-specific code: ~64 kB
- Fast rendering with React 18
- Efficient chart updates

### Type Safety
- **Full TypeScript** implementation
- Type-safe GraphQL queries
- Prevents common errors

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2017+ JavaScript features
- CSS Grid and Flexbox

### Deployment Ready
- **Vercel-optimized**
- Environment agnostic
- No server-side configuration needed
- Instant global CDN deployment

## Data Flow

```
User Input → GraphQL Query → API Response → Data Transform → Chart Display
```

1. User fills form with token details
2. Click Execute button
3. App constructs GraphQL query
4. Sends request to selected endpoint
5. Receives OHLC price data
6. Transforms to chart format
7. Displays interactive candlestick chart

## Chart Interactions

- **Pan**: Click and drag to move through time
- **Zoom**: Scroll or pinch to zoom in/out
- **Crosshair**: Hover to see exact price and time
- **Auto-fit**: Chart automatically fits all data on load

## GraphQL Integration

### Query Structure
- Uses `graphql-request` for lightweight requests
- Typed responses with TypeScript
- Error handling and retry logic

### Variables
- `mint`: Token address
- `chain`: Hardcoded to "SOLANA"
- `interval`: User-selected timeframe
- `from`: ISO 8601 start datetime
- `to`: ISO 8601 end datetime

## Future Enhancement Possibilities

- Volume data display
- Technical indicators (MA, RSI, etc.)
- Multiple token comparison
- Export chart as image
- Historical data caching
- WebSocket real-time updates
- Dark mode toggle
- Favorite tokens list
- Custom color schemes
