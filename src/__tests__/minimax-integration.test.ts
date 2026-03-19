import { describe, it, expect } from 'vitest';

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_ENDPOINT = 'https://api.minimax.io/v1/chat/completions';

describe.skipIf(!MINIMAX_API_KEY)('MiniMax API integration', () => {
  it('should complete a chat request with MiniMax-M2.7', async () => {
    const response = await fetch(MINIMAX_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        messages: [{ role: 'user', content: 'Say hello in one word.' }],
        temperature: 1,
        top_p: 1,
        max_tokens: 10,
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.choices).toBeDefined();
    expect(data.choices.length).toBeGreaterThan(0);
    expect(data.choices[0].message.content).toBeTruthy();
  }, 30000);

  it('should complete a streaming request with MiniMax-M2.7-highspeed', async () => {
    const response = await fetch(MINIMAX_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7-highspeed',
        messages: [{ role: 'user', content: 'Say hi.' }],
        temperature: 0.7,
        top_p: 1,
        max_tokens: 10,
        stream: true,
      }),
    });

    expect(response.ok).toBe(true);
    expect(response.body).toBeDefined();

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let receivedData = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      if (text.includes('data:')) {
        receivedData = true;
      }
    }

    expect(receivedData).toBe(true);
  }, 30000);

  it('should handle clamped temperature correctly', async () => {
    const response = await fetch(MINIMAX_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        messages: [{ role: 'user', content: 'Say OK.' }],
        temperature: 0.01,
        top_p: 1,
        max_tokens: 5,
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.choices[0].message.content).toBeTruthy();
  }, 30000);
});
