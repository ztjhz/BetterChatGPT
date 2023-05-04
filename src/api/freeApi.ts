import { ConfigInterface, MessageInterface } from '@type/chat';

export const getChatCompletion = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface
) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      ...config,
    }),
  });
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  return data;
};

export async function getChatCompletionStream(endpoint: string, messages: MessageInterface[], config: ConfigInterface) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      ...config,
      stream: true,
    }),
  });

  if (response.status === 404 || response.status === 405) {
    throw new Error('Invalid API endpoint! Please check your API endpoint.');
  }

  if (response.status === 429 || !response.ok) {
    const text = await response.text();
    let error = text;
    if (text.includes('insufficient_quota')) {
      error += '\nPlease change your API endpoint or API key.';
    }
    throw new Error(error);
  }

  return response.body;
}

