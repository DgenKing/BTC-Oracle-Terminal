// src/lib/market-data.ts

export interface MarketData {
  price: number;
  change24h: number;
  rsi: number;
  weeklyOpen: number;
  weeklyClose: number;
}

async function fetchViaProxy(url: string) {
  const res = await fetch(`/api/proxy?target=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("PROXY_ERROR");
  return res.json();
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
  return 100 - (100 / (1 + (avgGain / avgLoss)));
}

export const getMarketData = async (): Promise<MarketData> => {
  try {
    const priceData = await fetchViaProxy('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    const currentPrice = priceData.bitcoin.usd;
    const change24h = priceData.bitcoin.usd_24h_change;

    const historyData = await fetchViaProxy('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily');
    const closePrices = historyData.prices.map((p: number[]) => p[1]);
    const rsi = calculateRSI(closePrices, 14);

    const now = new Date();
    const day = now.getUTCDay();
    const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
    const mondayTs = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff, 0, 0, 0)).getTime();
    
    let weeklyOpen = currentPrice;
    let minDiff = Infinity;
    for (const [ts, price] of historyData.prices) {
       const tDiff = Math.abs(ts - mondayTs);
       if (tDiff < minDiff) { minDiff = tDiff; weeklyOpen = price; }
    }

    return { price: currentPrice, change24h, rsi, weeklyOpen, weeklyClose: currentPrice };
  } catch (error) {
    return { price: 0, change24h: 0, rsi: 50, weeklyOpen: 0, weeklyClose: 0 };
  }
};

export const getWeeklyBias = (data: MarketData): 'BULLISH' | 'BEARISH' => {
  if (!data.price) return 'BULLISH';
  return data.weeklyClose >= data.weeklyOpen ? 'BULLISH' : 'BEARISH';
};

export interface MAData {
  ma50: number; ma100: number; ma200: number; ma200w: number; currentPrice: number;
}

export const getMAData = async (): Promise<MAData> => {
  const historyData = await fetchViaProxy('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1500&interval=daily');
  const prices = historyData.prices.map((p: number[]) => p[1]);
  const currentPrice = prices[prices.length - 1];

  const calcMA = (data: number[], p: number) => data.length < p ? 0 : data.slice(-p).reduce((a, b) => a + b, 0) / p;
  
  const calcWMA = (data: number[], weeks: number) => {
    const p = weeks * 7;
    if (data.length < p) return 0;
    const weeklyCloses = [];
    for (let i = data.length - 1; i >= 0 && weeklyCloses.length < weeks; i -= 7) {
      weeklyCloses.push(data[i]);
    }
    return weeklyCloses.reduce((a, b) => a + b, 0) / weeks;
  };

  return { ma50: calcMA(prices, 50), ma100: calcMA(prices, 100), ma200: calcMA(prices, 200), ma200w: calcWMA(prices, 200), currentPrice };
};
