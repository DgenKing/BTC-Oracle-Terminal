// src/lib/binance.ts

export interface FuturesData {
  fundingRate: number;
  openInterest: number;
  lsRatio: number;
  nextFundingTime: number;
  symbol: string;
}

const isDev = import.meta.env.DEV;
const BASE_URL = 'https://fapi.binance.com/fapi/v1';

// Binance blocks CORS - need proxy in production, but try direct in dev
async function fetchBinance(url: string) {
  if (isDev) {
    // In dev mode, try direct fetch (will fail due to CORS in browser)
    // User should run "vercel dev" for full functionality
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Binance API Error: ${res.status}`);
      return res.json();
    } catch (e: any) {
      if (e.message?.includes('CORS') || e.name === 'TypeError') {
        throw new Error('BINANCE_CORS_BLOCKED: Run "vercel dev" for Binance data, or deploy to Vercel.');
      }
      throw e;
    }
  }

  // Production: use Vercel serverless proxy
  const res = await fetch(`/api/proxy?target=${encodeURIComponent(url)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown' }));
    throw new Error(err.error || 'PROXY_ERROR');
  }
  return res.json();
}

export async function getFundingRate(): Promise<{ rate: number; nextTime: number }> {
  const data = await fetchBinance(`${BASE_URL}/premiumIndex?symbol=BTCUSDT`);
  return {
    rate: parseFloat(data.lastFundingRate) * 100,
    nextTime: data.nextFundingTime,
  };
}

export async function getOpenInterest(): Promise<number> {
  const data = await fetchBinance(`${BASE_URL}/openInterest?symbol=BTCUSDT`);
  return parseFloat(data.openInterest);
}

export async function getLongShortRatio(): Promise<number> {
  const data = await fetchBinance(`${BASE_URL}/globalLongShortAccountRatio?symbol=BTCUSDT&period=5m&limit=1`);
  return parseFloat(data[0].longShortRatio);
}
