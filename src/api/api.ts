import { server_api_endpoint } from '@constants/auth';
import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, MessageInterface } from '@type/chat';
import { isAzureEndpoint } from '@utils/api';
import { split } from 'lodash';
import { fetchEventSource } from '@microsoft/fetch-event-source';
function parseSSEMessage(message: string): string {
  const regex = /data:(.+?)\n\n/g;
  let match;
  let result = '';

  while ((match = regex.exec(message)) !== null) {
    if (match[1]) {
      result += match[1];
    }
  }

  return result;
}
class FatalError extends Error { }

const handleStreamResponse = async ({body, callback, onError, url, eventHandler}: any) => {
  const controller = new AbortController();
  let text = "";
  let done = false;
  eventHandler('start', true)
  const response = await fetchEventSource(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    signal: controller.signal,
    body: JSON.stringify(body),
    onerror: (event: any) => {
      if(done){
        return
      }
      done = true
      onError();
      controller.abort();
      throw new FatalError();
    },
    onmessage: (event: any) => {
      if(done){
        eventHandler('done', true)
        return
      }
      console.log(url, ':', event.data)

      if(event.data.includes("Action Input")){
        const input_value = event.data.split(':')[1]
        eventHandler('action', input_value)
        return
      }

      if(event.data.includes("Sorry") || event.data.includes("抱歉")){
        done = true
        onError();
        controller.abort();
        eventHandler('done', true)
        return
      }

      eventHandler('message')
      text += event.data
      callback(text, false)
    },
    onclose: () => {
      eventHandler('done', true)
      callback(text, true)
    }
  });
}

export const getSearchByType = async({type, query, callback, onError,eventHandler}: any) => {
  return await handleStreamResponse({
    url: `${server_api_endpoint}/search/${type}`,
    body: {
      query
    },
    callback,
    onError: onError,
    eventHandler: eventHandler
  })
}

export const getChatServerResponse = async (
  messages: MessageInterface[],
  conversationId: string,
  sources: any
) => {
  const response = await fetch(`${server_api_endpoint}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      conversationId,
      sources
    }),
  })

  return await response.json();
}
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
  if (response.status === 404 || response.status === 405) {
    const text = await response.text();
    if (text.includes('model_not_found')) {
      throw new Error(
        text +
          '\nMessage from Better ChatGPT:\nPlease ensure that you have access to the GPT-4 API!'
      );
    } else {
      throw new Error(
        'Message from Better ChatGPT:\nInvalid API endpoint! We recommend you to check your free API endpoint.'
      );
    }
  }

  if (response.status === 429 || !response.ok) {
    const text = await response.text();
    let error = text;
    if (text.includes('insufficient_quota')) {
      error +=
        '\nMessage from Better ChatGPT:\nWe recommend changing your API endpoint or API key';
    } else if (response.status === 429) {
      error += '\nRate limited!';
    }
    throw new Error(error);
  }

  const stream = response.body;
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
