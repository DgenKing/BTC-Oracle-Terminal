import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_DOMAINS = [
  'api.coingecko.com',
  'api.bybit.com',
  'api.alternative.me',
  'api.deepseek.com'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Basic Authentication (Optional but recommended)
  const authHeader = req.headers.authorization;
  const expectedAuth = process.env.INTERNAL_API_KEY;
  
  if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { target } = req.query;

  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'Missing target URL' });
  }

  try {
    const targetUrl = new URL(target);
    
    // 2. Protocol Validation
    if (targetUrl.protocol !== 'https:') {
      return res.status(400).json({ error: 'Only HTTPS protocol is allowed' });
    }

    // 3. Domain Allowlisting (SSRF Protection)
    if (!ALLOWED_DOMAINS.includes(targetUrl.hostname)) {
      return res.status(403).json({ error: 'Domain not allowed' });
    }

    const response = await fetch(target, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BTC-Oracle-Terminal/1.0'
      }
    });

    if (!response.ok) {
      // 4. Sanitize Error Handling
      return res.status(response.status).json({ error: `Remote API Error: ${response.statusText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    // 4. Sanitize Error Handling
    console.error('Proxy error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
