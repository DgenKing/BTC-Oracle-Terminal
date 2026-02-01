// src/lib/oracle.ts
import { getMarketData, getWeeklyBias } from './market-data';
import { getMarketSentiment } from './sentiment';

export interface TradeRecommendation {
  bias: 'BULLISH' | 'BEARISH';
  sentiment: string;
  rsi: number;
  verdict: 'LONG' | 'SHORT' | 'NO TRADE';
  confidence: number;
  reasoning: string;
}

export const getTradeRecommendation = async (): Promise<TradeRecommendation> => {
  const data = await getMarketData();
  const sentiment = await getMarketSentiment();
  const bias = getWeeklyBias(data);
  
  // The Logic (simplified for prototype)
  let verdict: 'LONG' | 'SHORT' | 'NO TRADE' = 'NO TRADE';
  let confidence = 50;
  let reasoning = 'WAITING FOR CLEARER STRUCTURE.';

  if (bias === 'BULLISH') {
    if (data.rsi < 40) {
      verdict = 'LONG';
      confidence = 85;
      reasoning = 'WEEKLY BULLISH + OVERSOLD RSI. GOOD R:R ZONE.';
    } else if (data.rsi > 70) {
      verdict = 'NO TRADE';
      confidence = 60;
      reasoning = 'WEEKLY BULLISH BUT RSI OVERBOUGHT. WAIT FOR PULLBACK.';
    } else {
      verdict = 'LONG';
      confidence = 65;
      reasoning = 'TREND FOLLOWING. MONITOR LOWER TIMEFRAMES.';
    }
    
    // Sentiment counter-trade check
    if (sentiment.score > 80) {
      confidence -= 20;
      reasoning += ' WARNING: SENTIMENT OVERHEATED.';
    }
  } else { // BEARISH BIAS
    if (data.rsi > 60) {
      verdict = 'SHORT';
      confidence = 80;
      reasoning = 'WEEKLY BEARISH + RSI RESET. FADE THE RALLY.';
    } else if (data.rsi < 30) {
      verdict = 'NO TRADE';
      confidence = 60;
      reasoning = 'WEEKLY BEARISH BUT OVERSOLD. SHORT SQUEEZE RISK.';
    } else {
      verdict = 'SHORT';
      confidence = 65;
      reasoning = 'TREND FOLLOWING. SELL RALLIES.';
    }
  }

  return {
    bias,
    sentiment: sentiment.status,
    rsi: data.rsi,
    verdict,
    confidence,
    reasoning
  };
};
