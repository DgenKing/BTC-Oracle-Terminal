// src/lib/futures.ts - Bybit API (no geo-restrictions, CORS enabled)

export interface FuturesData {
  fundingRate: number;
  openInterest: number;
  lsRatio: number;
  nextFundingTime: number;
  symbol: string;
}

const BASE_URL = 'https://api.bybit.com/v5/market';

// Bybit has CORS enabled - call directly (no proxy needed)
async function fetchBybit(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Bybit API Error: ${res.status}`);
  }
  const data = await res.json();
  if (data.retCode !== 0) {
    throw new Error(`Bybit: ${data.retMsg}`);
  }
  return data.result;
}

export async function getFundingRate(): Promise<{ rate: number; nextTime: number }> {
  const data = await fetchBybit(`${BASE_URL}/tickers?category=linear&symbol=BTCUSDT`);
  const ticker = data.list[0];
  return {
    rate: parseFloat(ticker.fundingRate) * 100,
    nextTime: parseInt(ticker.nextFundingTime),
  };
}

export async function getOpenInterest(): Promise<number> {
  const data = await fetchBybit(`${BASE_URL}/open-interest?category=linear&symbol=BTCUSDT&intervalTime=5min&limit=1`);
  // Bybit returns OI in coins, multiply by price for USD value
  const oiCoins = parseFloat(data.list[0].openInterest);

  // Get current price for USD conversion
  const tickerData = await fetchBybit(`${BASE_URL}/tickers?category=linear&symbol=BTCUSDT`);
  const price = parseFloat(tickerData.list[0].lastPrice);

  return oiCoins * price;
}

export async function getLongShortRatio(): Promise<number> {
  const data = await fetchBybit(`${BASE_URL}/account-ratio?category=linear&symbol=BTCUSDT&period=1d&limit=1`);
  // Bybit returns buyRatio and sellRatio
  const entry = data.list[0];
  const buyRatio = parseFloat(entry.buyRatio);
  const sellRatio = parseFloat(entry.sellRatio);
  // Long/Short ratio = buyRatio / sellRatio
  return sellRatio > 0 ? buyRatio / sellRatio : 1;
}