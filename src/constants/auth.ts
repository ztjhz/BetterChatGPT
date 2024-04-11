export const officialAPIEndpoint =
  'https://gateway.ai.cloudflare.com/v1/7e298a91c3274f38a33f93ebe112cd91/gpt-cx/azure-openai/v41-platform-east-us/gpt-4-0125-preview/chat/completions?api-version=2024-02-15-preview';
const customAPIEndpoint =
  import.meta.env.VITE_CUSTOM_API_ENDPOINT || 'https://chatgpt-api.shn.hk/v1/';
export const defaultAPIEndpoint =
  import.meta.env.VITE_DEFAULT_API_ENDPOINT || officialAPIEndpoint;

export const availableEndpoints = [officialAPIEndpoint, customAPIEndpoint];
