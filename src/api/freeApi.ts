import { MessageInterface } from '@type/chat';

export const endpoint = 'https://chatgpt-api.shn.hk/v1/';

export const getChatCompletion = async (messages: MessageInterface[]) => {
  try {
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
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getChatCompletionStream = async (messages: MessageInterface[]) => {
  try {
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
    console.log(response);
    const stream = response.body;
    return stream;
  } catch (error) {
    console.error('Error:', error);
  }
};
