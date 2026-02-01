# BTC Oracle Terminal 🔮

> *A systematic trading framework that combines Weekly Bias logic, CME Gap analysis, and AI-weighted social sentiment to find 6:1 RR setups. Built for degens who value structural discipline over hype.*

![Terminal Preview](docs/preview.png)

## Features

### 🎯 Core Analysis
- **Weekly Bias System** - Close < Open = BEARISH, Close > Open = BULLISH
- **CME Gap Tracker** - Monitors unfilled gaps (they fill ~90% of the time)
- **RSI Calculator** - 14-period RSI with overbought/oversold alerts
- **Sentiment Engine** - AI-weighted social media analysis

### 🚫 The Bouncer (Risk Management)
- **6:1 Minimum R:R** - Trades below this ratio are REJECTED
- **Position Sizing** - Calculator based on account risk percentage
- **Counter-Trend Warnings** - Don't block good setups, just reduce size

### 📊 Data Sources
- Real-time BTC price via CoinGecko API
- Social sentiment via Tavily API
- Liquidation data via Coinglass API
- AI analysis via DeepSeek API

### 💻 Terminal Interface
- Retro CRT aesthetic (because we're degens)
- Mobile-first with quick command buttons
- Full keyboard support on desktop
- PWA installable

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- A Neon account (free tier works)
- DeepSeek API key

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/btc-oracle-terminal.git
cd btc-oracle-terminal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Get Your API Keys

| Service | Purpose | Cost | Get Key |
|---------|---------|------|---------|
| **DeepSeek** | AI Chat & Analysis | ~$0.14/M tokens | [platform.deepseek.com](https://platform.deepseek.com) |
| **CoinGecko** | Price Data | FREE | No key needed |
| **Neon** | Database | FREE (0.5GB) | [neon.tech](https://neon.tech) |

**Total cost: Just DeepSeek** (typically pennies per session)

---

## Commands

### Analysis Commands
| Command | Description |
|---------|-------------|
| `play` | Get current trade recommendation |
| `bias` | Show weekly bias (bull/bear) |
| `sentiment` | AI estimate of market mood |
| `analyze "tweets"` | Analyze pasted social content |
| `gaps` | Show unfilled CME gaps |
| `rsi` | Current RSI reading |
| `price` | Current BTC price and stats |

### Risk Management
| Command | Description |
|---------|-------------|
| `calc <entry> <stop> [target]` | Calculate R:R ratio |
| `size <risk%> <entry> <stop>` | Position size calculator |

### System
| Command | Description |
|---------|-------------|
| `help` | Show all commands |
| `clear` | Clear terminal |
| `ask <question>` | Ask the Oracle anything |

---

## The System Logic

### Weekly Bias (The Foundation)
```
IF weekly_close < weekly_open:
    bias = BEARISH
    DO NOT LONG (unless 10/10 setup)
ELSE:
    bias = BULLISH  
    DO NOT SHORT (unless 10/10 setup)
```

### Sentiment Analysis (Counter-Indicator)
```
IF bullish_sentiment > 80%:
    signal = OVERHEATED (fade the longs)
IF bearish_sentiment > 80%:
    signal = FEARFUL (fade the shorts)
IF 40% < sentiment < 60%:
    signal = NEUTRAL (trend continues)
```

### The Bouncer (Non-Negotiable)
```
IF risk_reward < 6:1:
    REJECT trade
    SHOW required adjustments
```

### Counter-Trend Handling
```
IF technicals = LONG AND weekly_bias = BEARISH:
    signal = "Counter-Trend: Reduce size 50%"
    confidence = confidence * 0.5
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Environment Variables for Production
Set these in your Vercel dashboard:
- `VITE_DEEPSEEK_API_KEY`
- `VITE_TAVILY_API_KEY`
- `VITE_COINGLASS_API_KEY`
- `DATABASE_URL`

---

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Database**: Neon (PostgreSQL) + Prisma
- **AI**: DeepSeek API
- **Animation**: Framer Motion
- **Hosting**: Vercel

---

## Project Structure

```
btc-oracle-terminal/
├── src/
│   ├── components/      # React components
│   │   └── terminal/    # Terminal UI
│   ├── lib/             # API clients & utilities
│   ├── types/           # TypeScript types
│   ├── constants/       # Prompts & config
│   ├── hooks/           # Custom React hooks
│   ├── App.tsx          # Main app
│   └── main.tsx         # Entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
└── ARCHITECTURE.md      # Full system design
```

---

## Roadmap

### Phase 1: Core Terminal ✅
- [x] Terminal UI with CRT effects
- [x] Command system
- [x] DeepSeek integration
- [x] Price fetching

### Phase 2: Analysis Engine 🚧
- [ ] Weekly bias calculator
- [ ] RSI calculation
- [ ] CME gap tracker
- [ ] 6:1 RR calculator

### Phase 3: Sentiment System
- [ ] Tavily integration
- [ ] Influencer reliability tracking
- [ ] Historical backtesting

### Phase 4: Advanced Features
- [ ] Liquidation heatmap
- [ ] Trade journal
- [ ] Push notifications

---

## Contributing

PRs welcome. Please follow the existing code style and add tests for new features.

---

## Disclaimer

This is not financial advice. This tool is for educational and entertainment purposes only. Trading cryptocurrency is risky and you can lose all your money. The "Oracle" is an AI that can be wrong. Always do your own research.

---

## License

MIT

---

*Built by DgenKing. Structural discipline over hype.* 🐂🐻


update:

What Changed
Removed:

Tavily API (paid social listening)
Coinglass API (paid liquidation data)

Added Instead:

sentiment command → DeepSeek estimates market mood from conditions
analyze "tweets" → Paste CT takes, DeepSeek classifies as BULLISH/BEARISH/COPE
getMarketMood() function → Free AI-powered sentiment without scraping

New Commands
sentiment     → AI estimates if market is GREEDY/FEARFUL/NEUTRAL
analyze       → Paste tweets for classification
rsi           → Live RSI from CoinGecko (free)
bias          → Live weekly candle (free)
price         → Live BTC price (free)
The sentiment approach is actually better for your use case - you're on CT anyway, so just paste what you're seeing and let DeepSeek categorise it. No rate limits, no extra API keys.
