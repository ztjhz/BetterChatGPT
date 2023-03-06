import { ConfigInterface, MessageInterface } from '@type/chat';

export const endpoint = 'https://chatgpt-api.shn.hk/v1/';

export const getChatCompletion = async (
  messages: MessageInterface[],
  config: ConfigInterface
) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
  messages: MessageInterface[],
  config: ConfigInterface
) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      ...config,
      stream: true,
    }),
  });
  const text = await response.text();
  if (response.status === 429 && text.includes('insufficient_quota'))
    throw new Error(
      text +
        '\nMessage from freechatgpt.chat:\nWe recommend changing your API endpoint or API key'
    );
  if (!response.ok) throw new Error(text);

  const stream = response.body;
  return stream;
};
