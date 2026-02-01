# BTC Oracle Terminal - Refined Expansion Plan (Add-ons)

## Objective
To transform the terminal into a professional-grade confluence workstation using 100% free data sources and efficient local calculations.

---

## Phase 1: The "Smart Money" Layer (Zero-Key) - **PRIORITY**
*High-impact positioning signals. Reliable, free, and no configuration required.*

### 1. Perpetual Futures (Binance Public API)
*   **`funding`**: Current BTC funding rate. (Positive = Long crowd, Negative = Short crowd).
*   **`oi`**: Open Interest + 24h Change. (Confluence for trend strength).
*   **`lsratio`**: Global Long/Short account ratio.

### 2. Technical Structure (CoinGecko History)
*   **`ma`**: Distance to key Moving Averages (50D, 100D, 200D, 200W).
*   *Implementation*: Computed locally using historical OHLC data to avoid extra API hits.

---

## Phase 2: Macro & On-Chain Layer (No-Key Wins)
*Broader context using existing APIs or truly public sources. No signups required.*

### 1. Market Context
*   **`dom`**: BTC Dominance. 
    *   *Source*: CoinGecko `/global` endpoint (Already integrated, no key needed).
*   **`hash`**: Bitcoin Hash Rate & Difficulty.
    *   *Source*: Blockchain.com Public API (Free, no signup).

### 2. Magnets & Pains
*   **`gaps`**: (Manual/Mocked). Acknowledge that real-time CME data lacks a free API. Maintain realistic manual/periodic updates for the prototype.
*   **`liqs`**: Liquidation Proxies. 
    *   *Strategy*: Use Binance taker long/short volume as a proxy for liquidation clusters if Coinglass free tier is too restrictive.

---

## Phase 3: Oracle V2 (Confluence Engine)
*Multi-factor ensemble logic for high-probability trade setups.*

### The 4 Pillars of Confluence:
1.  **Structure (30%)**: Weekly Bias + MA Alignment + RSI.
2.  **Positioning (30%)**: Funding Rate + OI Trend + L/S Ratio.
3.  **Macro/On-Chain (20%)**: BTC Dominance + Hash Rate Trend.
4.  **Sentiment (20%)**: Fear & Greed Index + AI social analysis (pasted text).

### Logic Requirements:
*   **Threshold**: Only approve setups with **>75% Confidence** and **6:1 RR**.
*   **Penalty**: Confidence and Size are cut by 50% if the trade is counter-trend to the Weekly Bias.

---

## Technical Infrastructure & Performance
*   **Caching**: Increase cache window to **15-30 minutes** for historical/macro data to stay within CoinGecko/Blockchain.com rate limits.
*   **Vercel Backend**: Keep all logic that *could* eventually use keys (like AI) in the Vercel serverless functions.
*   **Architecture Alignment**: Ensure all new components follow the standard Vite/React structure defined in `ARCHITECTURE.md`.