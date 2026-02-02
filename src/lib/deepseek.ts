// src/lib/deepseek.ts
import { recordCall } from './usage-tracker';

const isDev = import.meta.env.DEV;
const DIRECT_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export async function queryDeepSeek(prompt: string, systemPrompt: string = "You are the BTC Oracle Terminal AI.") {
  
  // DEV MODE: Call DeepSeek directly
  if (isDev && DIRECT_API_KEY && DIRECT_API_KEY !== 'your_api_key_here') {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DIRECT_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'DeepSeek API Error');
      }

      const data = await response.json();
      const tokens = data.usage?.total_tokens || Math.ceil((prompt.length + (data.choices[0].message.content?.length || 0)) / 4);
      recordCall(tokens);
      return data.choices[0].message.content;
    } catch (e: any) {
      console.error("Dev Mode AI Error:", e);
      throw e;
    }
  }

  // PROD MODE: Use Vercel serverless function
  const internalKey = import.meta.env.VITE_INTERNAL_API_KEY;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  if (internalKey) {
    headers['Authorization'] = `Bearer ${internalKey}`;
  }

  const response = await fetch('/api/oracle', {
    method: 'POST',
    headers,
    body: JSON.stringify({ prompt, systemPrompt })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API_ERROR: ${response.statusText}`);
  }

  const data = await response.json();
  const tokens = data.usage?.total_tokens || Math.ceil((prompt.length + (data.content?.length || 0)) / 4);
  recordCall(tokens);
  return data.content;
}