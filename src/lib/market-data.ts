// src/lib/market-data.ts

export interface MarketData {
  price: number;
  change24h: number;
  rsi: number;
  weeklyOpen: number;
  weeklyClose: number;
}

// RSI Calculation Helper
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Smoothing (Wilder's method could be added, but simple moving avg is okay for a quick fetch)
  // For better accuracy with minimal history, standard RSI usually needs more data (100+ candles). 
  // We'll use a simple RSI calculation here based on the last 14 days of data provided.
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1) + 0) / period;
    } else {
      avgGain = (avgGain * (period - 1) + 0) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(diff)) / period;
    }
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export const getMarketData = async (): Promise<MarketData> => {
  try {
    // 1. Fetch Current Price & 24h Change
    const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    const priceData = await priceRes.json();
    
    if (!priceData.bitcoin) throw new Error('Failed to fetch price');
    
    const currentPrice = priceData.bitcoin.usd;
    const change24h = priceData.bitcoin.usd_24h_change;

    // 2. Fetch Historical Data for RSI (30 days daily)
    const historyRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily');
    const historyData = await historyRes.json();
    
    // Extract closing prices (market_chart returns [timestamp, price])
    // The last item is usually the current partial candle, so we might want to exclude it for strict close-based RSI, 
    // but for "live" RSI we include the most recent price point.
    const closePrices = historyData.prices.map((p: number[]) => p[1]);
    const rsi = calculateRSI(closePrices, 14);

    // 3. Calculate Weekly Open (Monday 00:00 UTC)
    // We'll find the first timestamp in our history that matches the most recent Monday
    // Or simpler: Get the price from 7 days ago? No, bias is specific to Weekly Candle Open.
    
    // Let's approximate: 
    // Get current time, find last Monday 00:00 UTC.
    const now = new Date();
    const day = now.getUTCDay(); // 0 (Sun) - 6 (Sat)
    const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff, 0, 0, 0));
    
    // Find the price point in history closest to this timestamp
    // historyData.prices is [timestamp, price]
    const mondayTs = monday.getTime();
    
    // Find the entry with timestamp closest to mondayTs
    let weeklyOpen = currentPrice; 
    let minDiff = Infinity;
    
    for (const [ts, price] of historyData.prices) {
       const timeDiff = Math.abs(ts - mondayTs);
       if (timeDiff < minDiff) {
         minDiff = timeDiff;
         weeklyOpen = price;
       }
    }

    return {
      price: currentPrice,
      change24h,
      rsi,
      weeklyOpen,
      weeklyClose: currentPrice
    };

  } catch (error) {
    console.error("API Error:", error);
    // Fallback if API fails (rate limits, etc)
    return {
      price: 0,
      change24h: 0,
      rsi: 50,
      weeklyOpen: 0,
      weeklyClose: 0
    };
  }
};

export const getWeeklyBias = (data: MarketData): 'BULLISH' | 'BEARISH' => {
  if (!data.price) return 'BULLISH'; // Default to something if data failed
  return data.weeklyClose >= data.weeklyOpen ? 'BULLISH' : 'BEARISH';
};