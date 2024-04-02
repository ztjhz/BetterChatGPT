import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, MessageInterface, ModelOptions } from '@type/chat';
import { supportedModels } from '@constants/chat';
import { OpenAICompletionsConfig } from '@hooks/useSubmit';

export const isAuthenticated = async () => {
  try {
    const response = await fetch('/.auth/me');
    if (response.ok) {
      const data = await response.json();
      // Check if the user data exists and has necessary properties
      return data.clientPrincipal != null;
    }
    return false;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

export const redirectToLogin = async() => {
  // Redirect to a login route that triggers AAD authentication
  window.location.href = '/.auth/login/aad';
}


export const getChatCompletion = async (
  endpoint: string,
  messages: MessageInterface[],
  config: OpenAICompletionsConfig,
  customHeaders?: Record<string, string>
) => {

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const path = `chat/completions`;

  if (!endpoint.endsWith(path)) {
    if (!endpoint.endsWith('/')) {
      endpoint += '/';
    }
    endpoint += path;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      ...config
    }),
  });
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  return data;
};

export const getChatCompletionStream = async (
  endpoint: string,
  messages: MessageInterface[],
  config: OpenAICompletionsConfig,
  customHeaders?: Record<string, string>
) => {

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const path = `chat/completions`;

    if (!endpoint.endsWith(path)) {
      if (!endpoint.endsWith('/')) {
        endpoint += '/';
      }
      endpoint += path;
    }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
      ...config,
      stream: true,
    }),
  });

  if (response.status === 404 || response.status === 405) {
    const text = await response.text();

    if (text.includes('model_not_found')) {
      throw new Error(
        text +
          '\nModel not found. The API endpoint may not have access to the requested model: ${model}'
      );
    } else {
      throw new Error(
        'Invalid API endpoint, or API Gateway is down.\nPlease contact the application administrator...'
      );
    }
  }

  if (response.status === 429 || !response.ok) {
    const text = await response.text();
    let error = text;
    if (text.includes('insufficient_quota')) {
      error +=
        'API Quota Exceeded. Try again later';
    } else if (response.status === 429) {
      error += 'API Rate Exceeded. Try again later';
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
