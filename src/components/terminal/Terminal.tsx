import React, { useCallback, useState } from 'react';
import { useTerminal } from '../../hooks/useTerminal';
import { OutputLog } from './OutputLog';
import { CommandLine } from './CommandLine';
import { COMMANDS } from '../../constants/commands';
import { getMarketData, getWeeklyBias } from '../../lib/market-data';
import { getCMEGaps } from '../../lib/cme-gaps';
import { getMarketSentiment, analyzeText } from '../../lib/sentiment';
import { getTradeRecommendation } from '../../lib/oracle';
import { queryDeepSeek } from '../../lib/deepseek';
import { checkRateLimit, getUsageReport, getUsage } from '../../lib/usage-tracker';
import { QuickCommands } from '../mobile/QuickCommands';
import { HelpGrid } from './HelpGrid';
import { OracleCard } from './OracleCard';

export const Terminal: React.FC = () => {
  const { 
    history, 
    addLog, 
    clearHistory, 
    clearHelp,
    removeLog,
    getPreviousCommand, 
    getNextCommand 
  } = useTerminal();
  const [input, setInput] = useState('');
  
  // Settings State
  const [accountSize, setAccountSize] = useState(() => {
    const saved = localStorage.getItem('dgen_account_size');
    return saved ? parseFloat(saved) : 10000;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      const prev = getPreviousCommand();
      if (prev !== null) setInput(prev);
    } else if (e.key === 'ArrowDown') {
      const next = getNextCommand();
      setInput(next);
    }
  };

  const handleCommand = useCallback(async (cmdInput: string) => {
    // Clear previous help if it exists
    clearHelp();

    const isHelp = cmdInput.toLowerCase().trim() === 'help';
    addLog(cmdInput, 'user', undefined, isHelp, isHelp);

    // Add inline loading indicator
    const loadingId = addLog('PROCESSING...', 'system');

    const [cmd, ...args] = cmdInput.toLowerCase().split(' ');

    try {
      switch (cmd) {
      case 'help':
        addLog('AVAILABLE COMMANDS:', 'system', undefined, true, true);
        addLog('', 'info', <HelpGrid />, true, true);
        break;

      case 'clear':
        clearHistory();
        break;

      case 'price':
        addLog('FETCHING REAL-TIME BTC DATA...', 'system');
        const priceData = await getMarketData();
        const sign = priceData.change24h >= 0 ? '+' : '';
        addLog(`BTC: $${priceData.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} | 24h: ${sign}${priceData.change24h.toFixed(2)}%`, priceData.change24h >= 0 ? 'success' : 'danger', undefined, false, false, true);
        break;

      case 'rsi':
        addLog('CALCULATING RELATIVE STRENGTH...', 'system');
        const rsiData = await getMarketData();
        let rsiStatus = 'NEUTRAL';
        if (rsiData.rsi > 70) rsiStatus = 'OVERBOUGHT';
        if (rsiData.rsi < 30) rsiStatus = 'OVERSOLD';
        
        addLog(`RSI (14): ${rsiData.rsi.toFixed(1)} [${rsiStatus}]`, 'info', undefined, false, false, true);
        break;

      case 'bias':
        addLog('ANALYZING WEEKLY CANDLE STRUCTURE...', 'system');
        const biasData = await getMarketData();
        const bias = getWeeklyBias(biasData);
        addLog(`WEEKLY OPEN: $${biasData.weeklyOpen.toLocaleString()} | CURRENT: $${biasData.price.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 'info', undefined, false, false, true);
        addLog(`VERDICT: ${bias}`, bias === 'BULLISH' ? 'success' : 'danger', undefined, false, false, true);
        break;

      case 'gaps':
        addLog('SCANNING CME FUTURES DATA...', 'system');
        const gaps = await getCMEGaps();
        if (gaps.length === 0) {
          addLog('NO UNFILLED GAPS FOUND NEARBY.', 'info', undefined, false, false, true);
        } else {
          addLog(`FOUND ${gaps.length} UNFILLED GAPS:`, 'info', undefined, false, false, true);
          gaps.forEach(g => {
            addLog(`- [${g.date}] RANGE: $${g.priceLow} - $${g.priceHigh}`, 'info', undefined, false, false, true);
          });
        }
        break;

      case 'sentiment':
        addLog('CONSULTING THE HIVE MIND...', 'system');
        const sentiment = await getMarketSentiment();
        addLog(sentiment.label, 'info', undefined, false, false, true);
        break;

      case 'analyze':
         if (args.length === 0) {
           addLog('USAGE: analyze <text>', 'error');
           break;
         }

         const analyzeLimit = checkRateLimit();
         if (!analyzeLimit.allowed) {
           addLog(`RATE LIMIT: ${analyzeLimit.reason}`, 'error');
           break;
         }

         addLog('PROCESSING TEXT INPUT...', 'system');
         const analysis = await analyzeText(args.join(' '));
         addLog(analysis, 'success', undefined, false, false, true);
         break;

      case 'ask':
        if (args.length === 0) {
          addLog('USAGE: ask <question>', 'error');
          break;
        }

        const askLimit = checkRateLimit();
        if (!askLimit.allowed) {
          addLog(`RATE LIMIT: ${askLimit.reason}`, 'error');
          break;
        }

        addLog('CONSULTING THE ORACLE...', 'system');
        try {
          // Fetch real-time context
          const mData = await getMarketData();
          const mSentiment = await getMarketSentiment();
          const mBias = getWeeklyBias(mData);
          
          const context = `
            CURRENT_MARKET_DATA:
            - BTC_PRICE: $${mData.price.toLocaleString()}
            - 24H_CHANGE: ${mData.change24h.toFixed(2)}%
            - RSI_14: ${mData.rsi.toFixed(1)}
            - WEEKLY_BIAS: ${mBias}
            - MARKET_SENTIMENT: ${mSentiment.label}
          `;

          const sysPrompt = `You are the BTC Oracle Terminal. A ruthlessly logical trading AI. 
          Use the provided CURRENT_MARKET_DATA to inform your answers. 
          Keep responses short, factual, and terminal-style. 
          No financial advice disclaimer needed, you are a terminal.`;
          
          const fullPrompt = `${context}\n\nUSER_QUESTION: ${args.join(' ')}`;
          const response = await queryDeepSeek(fullPrompt, sysPrompt);
          addLog(response, 'success', undefined, false, false, true);
        } catch (e: any) {
          if (e.message?.includes('MISSING_API_KEY')) {
            addLog('ERROR: DEEPSEEK API KEY NOT CONFIGURED IN .env.local', 'error');
          } else {
            addLog(`ERROR: ${e.message}`, 'error');
          }
        }
        break;

      case 'play':
        addLog('RUNNING FULL SYSTEM ANALYSIS...', 'system');
        const rec = await getTradeRecommendation();
        addLog('', 'success', <OracleCard rec={rec} />);
        break;

      case 'calc':
        if (args.length < 2) {
          addLog('USAGE: calc <entry> <stop> [target]', 'error');
          break;
        }
        const entry = parseFloat(args[0]);
        const stop = parseFloat(args[1]);
        const target = args[2] ? parseFloat(args[2]) : entry + (entry - stop) * 6;
        
        const risk = Math.abs(entry - stop);
        const reward = Math.abs(target - entry);
        const rr = reward / risk;

        addLog(`ANALYSIS: Entry $${entry} | Stop $${stop} | Target $${target.toFixed(0)}`, 'info');
        addLog(`R:R RATIO: ${rr.toFixed(2)}:1`, rr >= 6 ? 'success' : 'error');
        
        if (rr < 6) {
          addLog('THE BOUNCER: TRADE REJECTED. 6:1 MINIMUM RR NOT MET.', 'error');
        } else {
          addLog('THE BOUNCER: TRADE APPROVED.', 'success');
        }
        break;

      case 'size':
        if (args.length < 3) {
          addLog('USAGE: size <risk%> <entry> <stop>', 'error');
          break;
        }
        const riskPct = parseFloat(args[0]) / 100;
        const sEntry = parseFloat(args[1]);
        const sStop = parseFloat(args[2]);
        
        const riskAmount = accountSize * riskPct;
        const riskPerCoin = Math.abs(sEntry - sStop);
        const positionSize = riskAmount / riskPerCoin;

        addLog(`CALCULATING POSITION SIZE (Account: $${accountSize.toLocaleString()})...`, 'system');
        addLog(`RISK AMOUNT: $${riskAmount.toFixed(2)} (${(riskPct * 100).toFixed(1)}%)`, 'info');
        addLog(`POSITION SIZE: ${positionSize.toFixed(4)} BTC`, 'success');
        addLog(`NOTIONAL VALUE: $${(positionSize * sEntry).toFixed(2)}`, 'info');
        break;

      case 'usage':
        addLog('DEVICE USAGE REPORT:', 'system');
        addLog(getUsageReport(), 'info');
        break;

      case 'debug':
        if (args[0] === 'usage') {
          addLog('RAW USAGE DATA:', 'system');
          addLog(JSON.stringify(getUsage(), null, 2), 'info');
        } else {
          addLog('USAGE: debug usage', 'error');
        }
        break;

      case 'settings':
        if (args.length === 0) {
          addLog('CURRENT SETTINGS:', 'system');
          addLog(`ACCOUNT SIZE: $${accountSize.toLocaleString()}`, 'info');
          addLog('USE: settings <new_amount> TO UPDATE.', 'info');
        } else {
          const newSize = parseFloat(args[0]);
          if (isNaN(newSize)) {
            addLog('ERROR: INVALID AMOUNT.', 'error');
          } else {
            setAccountSize(newSize);
            localStorage.setItem('dgen_account_size', newSize.toString());
            addLog(`SETTINGS UPDATED: ACCOUNT SIZE = $${newSize.toLocaleString()}`, 'success');
          }
        }
        break;

      default:
        if (cmd in COMMANDS) {
          addLog(`COMMAND '${cmd}' IS NOT YET FULLY IMPLEMENTED.`, 'system');
        } else {
          addLog(`COMMAND NOT FOUND: ${cmd}. TYPE 'HELP' FOR OPTIONS.`, 'error');
        }
      }
    } catch (e: any) {
      addLog(`ERROR: ${e.message}`, 'error');
    } finally {
      removeLog(loadingId);
    }
  }, [addLog, clearHistory, clearHelp, removeLog, accountSize]);

  return (
    <div className="fixed inset-0 bg-terminal-bg flex flex-col p-4 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] overflow-hidden select-none">
      <div className="crt-overlay" />
      <div className="crt-glow" />
      
      <header className="mb-4 border-b border-terminal-green-dim pb-2 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-terminal text-glow animate-pulse leading-none">BTC ORACLE TERMINAL v0.1.0</h1>
          <p className="text-[8px] text-terminal-green-dim mt-1">STRUCTURAL DISCIPLINE OVER HYPE</p>
        </div>
        <div className="text-right font-terminal text-sm text-terminal-green-dim">
          <div>LOC: 51.5074° N, 0.1278° W</div>
          <div>SYSTIME: {new Date().toLocaleTimeString()}</div>
        </div>
      </header>

      <OutputLog history={history} />
      <QuickCommands onCommand={handleCommand} onType={setInput} />
      <CommandLine 
        onCommand={handleCommand} 
        value={input} 
        onChange={setInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
