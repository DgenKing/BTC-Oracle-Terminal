import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Basic Authentication
  const authHeader = req.headers.authorization;
  const expectedAuth = process.env.INTERNAL_API_KEY;
  
  if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { prompt, systemPrompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const API_KEY = process.env.DEEPSEEK_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'DeepSeek API key not configured on server' });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt || "You are the BTC Oracle Terminal AI." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      // 2. Sanitize Error Handling
      console.error('DeepSeek API error:', response.statusText);
      return res.status(response.status).json({ error: 'DeepSeek API error' });
    }

    const data = await response.json();
    return res.status(200).json({ 
      content: data.choices[0].message.content,
      usage: data.usage 
    });
  } catch (error: any) {
    // 2. Sanitize Error Handling
    console.error('Oracle handler error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
