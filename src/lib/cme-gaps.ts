// src/lib/cme-gaps.ts

export interface CMEGap {
  id: string;
  priceLow: number;
  priceHigh: number;
  date: string;
  status: 'UNFILLED' | 'PARTIALLY_FILLED';
}

// In a real app, this would scrape a site like CME or use a paid API like Coinglass
export const getCMEGaps = async (): Promise<CMEGap[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Using more realistic "recent" mock gaps for the prototype 
    // to demonstrate the proximity logic without hardcoding 2020 data.
    const mockGaps: CMEGap[] = [
      { id: 'g1', priceLow: 62500, priceHigh: 63200, date: '2025-10-24', status: 'UNFILLED' },
      { id: 'g2', priceLow: 48000, priceHigh: 49500, date: '2025-05-12', status: 'UNFILLED' },
    ];
    
    return mockGaps;
  } catch (e) {
    return [];
  }
};

export const checkGapProximity = (currentPrice: number, gaps: CMEGap[]) => {
  return gaps.filter(gap => {
    const distance = Math.min(
      Math.abs(currentPrice - gap.priceLow),
      Math.abs(currentPrice - gap.priceHigh)
    );
    return distance < 2000;
  });
};
