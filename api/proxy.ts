import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { target } = req.query;

  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'Missing target URL' });
  }

  try {
    const response = await fetch(target, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BTC-Oracle-Terminal/1.0'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Remote API Error: ${errText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
