import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, MessageInterface } from '@type/chat';
import { isAzureEndpoint } from '@utils/api';

export const getChatCompletion = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface,
  apiKey?: string,
  customHeaders?: Record<string, string>
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  if (isAzureEndpoint(endpoint) && apiKey) headers['api-key'] = apiKey;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      ...config,
      max_tokens: undefined,
    }),
  });
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  return data;
};

export const getChatCompletionStream = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface,
  apiKey?: string,
  customHeaders?: Record<string, string>
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  if (isAzureEndpoint(endpoint) && apiKey) headers['api-key'] = apiKey;

  const source = new EventSource(endpoint, { withCredentials: true });
  const stream = new ReadableStream({
    start(controller) {
      source.onopen = () => console.log('Stream is open');
      source.onerror = (event) => controller.error(event);
      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.object === 'chat.completion.chunk') {
            controller.enqueue(data);
          }
        } catch (e) {
          console.warn('Skipping non-JSON message', event.data);
        }
      };
      source.addEventListener('chat.ended', (event) => controller.close());
    },
    cancel() {
      source.close();
    },
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      ...config,
      max_tokens: undefined,
      stream: true,
    }),
  });
  if (!response.ok) throw new Error(await response.text());

  return stream;
};


export const submitShareGPT = async (body: ShareGPTSubmitBodyInterface) => {
  const request = await fetch('https://sharegpt.com/api/conversations', {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const response = await request.json();
  const { id } = response;
  const url = `https://shareg.pt/${id}`;
  window.open(url, '_blank');
};
