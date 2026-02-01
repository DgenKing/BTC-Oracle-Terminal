// src/lib/binance.ts

export interface FuturesData {
  fundingRate: number;
  openInterest: number;
  lsRatio: number;
  nextFundingTime: number;
  symbol: string;
}

const BASE_URL = 'https://fapi.binance.com/fapi/v1';

export async function getFundingRate(): Promise<{ rate: number; nextTime: number }> {
  const res = await fetch(`${BASE_URL}/premiumIndex?symbol=BTCUSDT`);
  const data = await res.json();
  return {
    rate: parseFloat(data.lastFundingRate) * 100,
    nextTime: data.nextFundingTime,
  };
}

export async function getOpenInterest(): Promise<number> {
  const res = await fetch(`${BASE_URL}/openInterest?symbol=BTCUSDT`);
  const data = await res.json();
  return parseFloat(data.openInterest);
}

export async function getLongShortRatio(): Promise<number> {
  // Global Long/Short Account Ratio (5m period)
  const res = await fetch(`${BASE_URL}/globalLongShortAccountRatio?symbol=BTCUSDT&period=5m&limit=1`);
  const data = await res.json();
  return parseFloat(data[0].longShortRatio);
}

export async function getFullFuturesData(): Promise<FuturesData> {
  const [funding, oi, ls] = await Promise.all([
    getFundingRate(),
    getOpenInterest(),
    getLongShortRatio()
  ]);

  return {
    fundingRate: funding.rate,
    nextFundingTime: funding.nextTime,
    openInterest: oi,
    lsRatio: ls,
    symbol: 'BTCUSDT'
  };
}