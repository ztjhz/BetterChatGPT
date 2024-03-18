export const officialAPIEndpoint = 'https://api.openai.com/v1/chat/completions';

export const availableEndpoints = [officialAPIEndpoint, 'http://localhost:8787/v1/chat/completions'];

export const builtinAPIEndpoint =
  import.meta.env.VITE_CUSTOM_API_ENDPOINT || '/api/chat/completions';

export const defaultAPIEndpoint =
  import.meta.env.VITE_DEFAULT_API_ENDPOINT || builtinAPIEndpoint;

