# Quick Start Guide

## Get Running in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## Your First Chart

1. The form is pre-filled with example data
2. Click the blue **"Execute"** button
3. Wait 2-3 seconds for the chart to load
4. Interact with the chart (pan, zoom, hover)

---

## Deploy to Vercel (2 minutes)

### Option 1: Via Dashboard
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy"

### Option 2: Via CLI
```bash
npm install -g vercel
vercel
```

---

## Try Different Tokens

Replace the token address with:

- **SOL**: `So11111111111111111111111111111111111111112`
- **USDC**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **cbBTC**: `cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij` (default)

---

## Need More Info?

- **Full Setup**: [SETUP.md](SETUP.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Features**: [FEATURES.md](FEATURES.md)
- **Testing**: [TESTING.md](TESTING.md)
- **Overview**: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

---

## Troubleshooting

**Port 3000 in use?**
```bash
PORT=3001 npm run dev
```

**Build errors?**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

**Chart not loading?**
- Check internet connection
- Try switching between Sandbox/Staging endpoints
- Verify token address is valid
- Check browser console for errors

---

**That's it! You're ready to go.** 🚀
