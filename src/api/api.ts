import { server_api_endpoint } from '@constants/auth';
import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, MessageInterface } from '@type/chat';
import { getUserToken } from '@utils/api';
import { split } from 'lodash';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { request } from './request';
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
  const {access_token} = await getUserToken()
  let text = "";
  let done = false;
  eventHandler('start', true)
  fetchEventSource(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`
    },
    signal: controller.signal,
    body: JSON.stringify(body),
    onerror: (event: any) => {
      if(done){
        return
      }
      done = true
      onError();
      eventHandler('unUseful', true)
      controller.abort();
      throw new FatalError();
    },
    onmessage: (event: any) => {
      if(done){
        eventHandler('done', true)
        return
      }

      if(event.data.includes("Action Input")){
        const input_value = event.data.split(':')[1]
        eventHandler('action', input_value)
        return
      }

      if(text.length < 5 && (event.data.includes("Sorry") || event.data.includes("抱歉") || text.includes("抱歉"))){
        done = true
        text = ''
        callback(text, true)
        onError();
        controller.abort();
        eventHandler('unUseful', true)
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
  return controller
}

export const simplifyQuestion = async(query: string) => {
  const {data} = await request.post('/search/', {
    query,
    originalQuery: query
  })
  return data;
}

export const getSearchByType = async({type, query, callback, originalQuestion, onError,eventHandler}: any) => {
  return await handleStreamResponse({
    url: `${server_api_endpoint}/search/${type}`,
    body: {
      query,
      originalQuery: originalQuestion
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
