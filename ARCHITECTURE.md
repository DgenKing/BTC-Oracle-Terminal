# BTC Oracle Terminal - Architecture (Actual)

## Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Sources**: 
  - CoinGecko (Price, RSI, Weekly Bias)
  - Alternative.me (Market Sentiment)
  - Custom Logic (Risk Calculator, CME Gaps)

## Project Structure
```
btc-oracle-terminal/
├── src/
│   ├── components/      # React components
│   │   ├── terminal/    # Terminal UI elements (Log, Input, Cards)
│   │   ├── mobile/      # Touch-friendly quick buttons
│   ├── lib/             # API clients & Trading logic
│   ├── hooks/           # Custom React hooks (useTerminal)
│   ├── types/           # TypeScript interfaces
│   ├── constants/       # Command definitions & config
│   ├── App.tsx          # Main layout & terminal instance
│   └── main.tsx         # Entry point
```

## Core Systems
1. **Terminal Engine**: Custom hook-based state for command history and log management.
2. **Oracle Decision Engine**: Aggregates market data, sentiment, and technicals to provide verdicts.
3. **The Bouncer**: Logic-gate that enforces a strict 6:1 Reward-to-Risk ratio.
4. **Retro CRT UI**: Tailwind-based scanline, flicker, and glow effects.