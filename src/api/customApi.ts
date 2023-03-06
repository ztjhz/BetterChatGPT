import { ConfigInterface, MessageInterface } from '@type/chat';

export const endpoint = 'https://api.openai.com/v1/chat/completions';

export const validateApiKey = async (apiKey: string) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();

    if (response.status === 401) return false;
    else if (response.status === 400) return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export const getChatCompletion = async (
  apiKey: string,
  messages: MessageInterface[],
  config: ConfigInterface
) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      ...config,
    }),
  });
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  return data;
};

export const getChatCompletionStream = async (
  apiKey: string,
  messages: MessageInterface[],
  config: ConfigInterface
) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      ...config,
      stream: true,
    }),
  });
  if (!response.ok) throw new Error(await response.text());

  const stream = response.body;
  return stream;
};
