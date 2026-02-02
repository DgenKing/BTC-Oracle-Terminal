// src/lib/usage-tracker.ts

export interface UsageData {
  totalCalls: number;
  todayCalls: number;
  todayDate: string;
  totalTokensEstimate: number;
  lastCallTime: number;
  sessionId: string;
}

const STORAGE_KEY = 'dgen_usage';
const LIMITS = {
  PER_MINUTE: 5,
  PER_DAY: 50,
};

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function createNewUsage(): UsageData {
  return {
    totalCalls: 0,
    todayCalls: 0,
    todayDate: getTodayDate(),
    totalTokensEstimate: 0,
    lastCallTime: 0,
    sessionId: Math.random().toString(36).substring(2, 9).toUpperCase(),
  };
}

export function getUsage(): UsageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const newUsage = createNewUsage();
      saveUsage(newUsage);
      return newUsage;
    }
    
    const data: UsageData = JSON.parse(atob(stored));
    // Reset if new day
    if (data.todayDate !== getTodayDate()) {
      data.todayCalls = 0;
      data.todayDate = getTodayDate();
      saveUsage(data);
    }
    return data;
  } catch (e) {
    const newUsage = createNewUsage();
    saveUsage(newUsage);
    return newUsage;
  }
}

export function saveUsage(data: UsageData) {
  localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(data)));
}

export function recordCall(tokensUsed: number) {
  const usage = getUsage();
  usage.totalCalls++;
  usage.todayCalls++;
  usage.totalTokensEstimate += tokensUsed;
  usage.lastCallTime = Date.now();
  saveUsage(usage);
  return usage;
}

export function checkRateLimit(): { allowed: boolean; reason?: string } {
  const usage = getUsage();
  const now = Date.now();

  // 1. Daily Limit
  if (usage.todayCalls >= LIMITS.PER_DAY) {
    return { allowed: false, reason: `DAILY LIMIT REACHED (${LIMITS.PER_DAY} calls). RESET AT MIDNIGHT UTC.` };
  }

  // 2. Minute Limit (Simple check: last call must be > 12s ago if we want to spread 5 calls/min, 
  // or just track timestamps. For simplicity, we'll just check if they are spamming.)
  // Real rate limiting would track a window of timestamps.
  const timeSinceLastCall = now - usage.lastCallTime;
  if (timeSinceLastCall < 2000) { // 2 second cooldown
    return { allowed: false, reason: 'SYSTEM COOLDOWN ACTIVE. WAIT 2 SECONDS.' };
  }

  return { allowed: true };
}

export function getUsageReport(): string {
  const u = getUsage();
  const lastCall = u.lastCallTime === 0 ? 'NEVER' : new Date(u.lastCallTime).toLocaleTimeString();
  
  return `
DEVICE SESSION: ${u.sessionId}
TODAY: ${u.todayCalls} / ${LIMITS.PER_DAY} CALLS
TOTAL: ${u.totalCalls} CALLS
TOKENS: ~${u.totalTokensEstimate.toLocaleString()}
LAST CALL: ${lastCall}
  `.trim();
}
