import { MessageInterface } from '@type/chat';

export const endpoint = 'https://chatgpt-api.shn.hk/v1/';

export const getChatCompletion = async (messages: MessageInterface[]) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
    }),
  });
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  return data;
};

export const getChatCompletionStream = async (messages: MessageInterface[]) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      stream: true,
    }),
  });
  if (!response.ok) throw new Error(await response.text());

  const stream = response.body;
  return stream;
};
