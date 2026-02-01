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
} as const;

export type CommandKey = keyof typeof COMMANDS;
