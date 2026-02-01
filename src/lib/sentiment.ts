// src/lib/sentiment.ts
import { queryDeepSeek } from './deepseek';

export type SentimentStatus = 'EXTREME_GREED' | 'GREED' | 'NEUTRAL' | 'FEAR' | 'EXTREME_FEAR';

export interface SentimentResult {
  score: number; // 0-100
  status: SentimentStatus;
  label: string;
}

export const getMarketSentiment = async (): Promise<SentimentResult> => {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1');
    const data = await res.json();
    
    if (data.data && data.data.length > 0) {
      const item = data.data[0];
      const score = parseInt(item.value);
      const label = item.value_classification.toUpperCase().replace(' ', '_');
      
      // Map API text to our type
      let status: SentimentStatus = 'NEUTRAL';
      if (label.includes('EXTREME_GREED')) status = 'EXTREME_GREED';
      else if (label.includes('GREED')) status = 'GREED';
      else if (label.includes('EXTREME_FEAR')) status = 'EXTREME_FEAR';
      else if (label.includes('FEAR')) status = 'FEAR';
      
      return {
        score,
        status,
        label: `MARKET IS ${status.replace('_', ' ')} (${score}/100).`
      };
    }
    throw new Error('No data');
  } catch (e) {
    return {
      score: 50,
      status: 'NEUTRAL',
      label: 'SENTIMENT DATA UNAVAILABLE.'
    };
  }
};

export const analyzeText = async (text: string): Promise<string> => {
  try {
    const systemPrompt = `You are a crypto sentiment analyzer. 
    Classify the following text as BULLISH, BEARISH, or COPE. 
    Be terse. One sentence maximum. 
    Format: CLASSIFICATION: [TYPE]. [REASONING]`;
    
    const result = await queryDeepSeek(text, systemPrompt);
    return result;
  } catch (e: any) {
    if (e.message?.includes('MISSING_API_KEY')) {
      return "FALLBACK: " + localKeywordAnalysis(text);
    }
    return `ERROR: AI ANALYSIS FAILED. (${e.message})`;
  }
};

function localKeywordAnalysis(text: string): string {
  const lower = text.toLowerCase();
  const bullWords = ['moon', 'pump', 'buy', 'long', 'bull', 'breakout', 'send it', 'god candle', 'wagmi', 'accumulation'];
  const bearWords = ['dump', 'crash', 'sell', 'short', 'bear', 'breakdown', 'rekt', 'rug', 'capitulation', 'distribution'];
  
  let bullScore = 0;
  let bearScore = 0;
  
  bullWords.forEach(w => { if (lower.includes(w)) bullScore++; });
  bearWords.forEach(w => { if (lower.includes(w)) bearScore++; });
  
  if (bullScore > bearScore) return `CLASSIFICATION: BULLISH. DETECTED OPTIMISM via keyword scanning.`;
  if (bearScore > bullScore) return `CLASSIFICATION: BEARISH. DETECTED FEAR via keyword scanning.`;
  
  return 'CLASSIFICATION: NEUTRAL / NOISE. NO CLEAR BIAS DETECTED.';
}
