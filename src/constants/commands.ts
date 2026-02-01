export const COMMANDS = {
  // Core Analysis
  'play': 'Get the current trade recommendation',
  'bias': 'Show weekly bias (bull/bear)',
  'sentiment': 'Run social sentiment analysis',
  'gaps': 'Show unfilled CME gaps',
  'rsi': 'Current RSI reading',
  'price': 'Current BTC price and stats',
  
  // Risk Management
  'calc': 'Calculate if trade meets 6:1 RR (usage: calc <entry> <stop> [target])',
  'size': 'Position size calculator (usage: size <risk%> <entry> <stop>)',
  
  // Research
  'analyze': 'Analyze pasted social content for sentiment',
  
  // System
  'clear': 'Clear terminal',
  'help': 'Show all commands',
  'ask': 'Ask the Oracle anything (AI chat)',
  'settings': 'View/update account settings (usage: settings [accountSize])',
  'usage': 'Show device API usage report',
  'debug': 'System debug info (usage: debug usage)',
  'funding': 'Current BTC funding rate (Binance Futures)',
  'oi': 'BTC Open Interest data',
  'lsratio': 'Global BTC Long/Short account ratio',
  'ma': 'Distance to key Moving Averages (50D, 100D, 200D, 200W)',
} as const;

export type CommandKey = keyof typeof COMMANDS;
