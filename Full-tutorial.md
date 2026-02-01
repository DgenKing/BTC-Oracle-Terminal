# 🔮 BTC Oracle Terminal: The Definitive User Guide (v0.1.1)

Welcome to the **BTC Oracle Terminal** — a disciplined, systematic trading workstation designed for high-probability Bitcoin setups. This is **not** a gambling tool. It enforces structural market bias, real-time technical signals, AI-powered sentiment, and strict risk rules to filter noise and deliver only quality trades.

---

## 🛠️ Command Directory (All 17 Commands)

### 1. Market Data & Technicals
- **price**  
  Fetches live BTC/USD price + 24h change from CoinGecko via a secure Vercel proxy.
- **rsi**  
  Calculates a precise 14-period RSI using 100 days of daily history and Wilder's Smoothing.
- **ma**  
  Calculates distance (%) to key Moving Averages: **50D, 100D, 200D, and 200W**. Essential for spotting overextension.
- **bias**  
  Compares current price to the surgical Monday 00:00 UTC open.  
  → Above = **BULLISH** weekly bias | Below = **BEARISH** weekly bias.
- **gaps**  
  Scans for unfilled CME Bitcoin futures gaps (price magnets).

### 2. Market Positioning (Bybit Futures)
- **funding**  
  Live BTC funding rate from Bybit. (Positive = Longs are paying shorts | Negative = Shorts are paying longs).
- **oi**  
  Current BTC Open Interest in Billions. Rising OI with rising price confirms trend strength.
- **lsratio**  
  Global Long/Short account ratio. Detects when the "dumb money" crowd is overcrowded.

### 3. AI Oracle & Sentiment
- **sentiment**  
  Fetches the current Crypto Fear & Greed Index (0-100).
- **analyze <text>**  
  Paste any news or social media text. **DeepSeek AI** classifies it as **BULLISH**, **BEARISH**, or **COPE**.
- **ask <question>**  
  Ask the Oracle anything. The AI automatically receives **Live Context Injection** (Price, RSI, Bias, Sentiment) before answering.

### 4. Execution & Risk (The Bouncer)
- **play**  
  Full system scan. Generates a high-tech **Oracle Report Card** with a clear verdict: **LONG**, **SHORT**, or **NO TRADE**.
- **calc <entry> <stop> [target]**  
  Validates setups against **The Bouncer**.  
  Rule: **Reward:Risk must be ≥ 6:1** or the trade is **REJECTED**.
- **size <risk%> <entry> <stop>**  
  Calculates exact position size in BTC based on your account settings.

### 5. System & Navigation
- **usage**  
  Shows your device API usage, remaining daily quota (50 calls), and unique Session ID.
- **settings [amount]**  
  View or update your account balance (saved locally in browser).
- **help**  
  Displays the command grid (automatically clears on the next command).
- **clear**  
  Wipes the terminal log history.

---

## 🎮 Pro User Interface Guide

### Interactive Features
- **Fast Typing Effect**: System responses type out at **10ms per character** for a realistic terminal feel.
- **Command History**: Use **↑ / ↓ arrow keys** on desktop to cycle through your last 50 commands.
- **Mobile Quick Buttons**: A 4x4 grid at the bottom provides one-tap execution for data and pre-fill templates for complex commands.
- **Inline Loading**: The `[SYSTEM]: PROCESSING...` indicator appears contextually and clears once data arrives.

### PWA Installation (Run as an App)
You can install the terminal as a standalone app on your home screen or desktop:
1. **iOS**: Safari → Share → **Add to Home Screen**.
2. **Android**: Chrome → 3 dots → **Install App**.
3. **Desktop**: Chrome/Edge → Address Bar → **Install Icon** (right side).

---

## 📈 Core Strategy: "Monday-Tuesday Quality Trade"

**Objective**: 1 high-probability trade per week.

1. **Monday (The Wait)**: Wait for CME to open and set the **Monday Open** price.
2. **Tuesday (The Bias)**: Run `bias`. If price is above Monday open, look for LONGS.
3. **The Confluence**: Wait for price to touch the Monday Open again. Check:
   - `funding`: Is it neutral or negative (for longs)?
   - `ma`: Are we near a key support MA (like 50D or 200W)?
   - `play`: Does the Oracle give a >75% confidence verdict?
4. **The Bouncer**: Run `calc`. Ensure you have a **6:1 R:R**.
5. **The Exit**: Close by Friday New York close. **No weekend holds.**

---

## ⚙️ Technical Notes & Security
- **Secure Backend**: All API keys (DeepSeek) are stored on the Vercel server. Users cannot see or steal your keys.
- **API Proxy**: CoinGecko data is routed through a proxy to bypass browser restrictions.
- **Bybit Data**: Futures data (Funding/OI) is fetched directly from Bybit's public API.
- **Rate Limiting**: Limited to 50 AI calls per day per device to manage costs.

**Structural Discipline Over Hype. Trade like a machine.** 🔮🚀