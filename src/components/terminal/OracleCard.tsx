import React from 'react';
import { TradeRecommendation } from '../../lib/oracle';

interface OracleCardProps {
  rec: TradeRecommendation;
}

export const OracleCard: React.FC<OracleCardProps> = ({ rec }) => {
  const isBullish = rec.bias === 'BULLISH';
  const verdictColor = rec.verdict === 'LONG' ? 'text-terminal-green' : rec.verdict === 'SHORT' ? 'text-terminal-red' : 'text-terminal-amber';
  
  return (
    <div className="border border-terminal-green-dim p-3 my-2 bg-terminal-bg relative overflow-hidden">
      {/* Background glow based on verdict */}
      <div className={`absolute inset-0 opacity-5 pointer-events-none ${rec.verdict === 'LONG' ? 'bg-terminal-green' : rec.verdict === 'SHORT' ? 'bg-terminal-red' : ''}`} />
      
      <div className="flex justify-between border-b border-terminal-green-dim pb-2 mb-3">
        <span className="text-xl font-bold uppercase tracking-widest">Oracle Report</span>
        <span className={`${isBullish ? 'text-terminal-green' : 'text-terminal-red'} font-bold`}>
          {rec.bias}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-terminal-green-dim uppercase">Sentiment</span>
          <span className="text-terminal-amber">{rec.sentiment}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-terminal-green-dim uppercase">RSI (14)</span>
          <span>{rec.rsi.toFixed(1)}</span>
        </div>
      </div>

      <div className="border-t border-terminal-green-dim pt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-terminal-green-dim uppercase">Verdict</span>
          <span className="text-xs text-terminal-green-dim uppercase">Confidence</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-2xl font-bold ${verdictColor}`}>{rec.verdict}</span>
          <span className="text-xl font-mono">{rec.confidence}%</span>
        </div>
        <div className="mt-3 text-sm italic border-l-2 border-terminal-amber pl-2 py-1">
          {rec.reasoning}
        </div>
      </div>
    </div>
  );
};
