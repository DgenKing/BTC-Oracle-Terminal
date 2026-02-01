// src/lib/binance.ts

export interface FuturesData {
  fundingRate: number;
  openInterest: number;
  lsRatio: number;
  nextFundingTime: number;
  symbol: string;
}

async function fetchViaProxy(url: string) {
  const res = await fetch(`/api/proxy?target=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("PROXY_ERROR");
  return res.json();
}

const BASE_URL = 'https://fapi.binance.com/fapi/v1';

export async function getFundingRate(): Promise<{ rate: number; nextTime: number }> {
  const data = await fetchViaProxy(`${BASE_URL}/premiumIndex?symbol=BTCUSDT`);
  return {
    rate: parseFloat(data.lastFundingRate) * 100,
    nextTime: data.nextFundingTime,
  };
}

export async function getOpenInterest(): Promise<number> {
  const data = await fetchViaProxy(`${BASE_URL}/openInterest?symbol=BTCUSDT`);
  return parseFloat(data.openInterest);
}

export async function getLongShortRatio(): Promise<number> {
  const data = await fetchViaProxy(`${BASE_URL}/globalLongShortAccountRatio?symbol=BTCUSDT&period=5m&limit=1`);
  return parseFloat(data[0].longShortRatio);
}
