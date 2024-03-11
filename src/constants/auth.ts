export const officialAPIEndpoint = 'https://api.openai.com/v1/chat/completions';

export const availableEndpoints = [officialAPIEndpoint];

export const customAPIEndpoint =
  import.meta.env.VITE_CUSTOM_API_ENDPOINT || '/api/chat/completions';

export const defaultAPIEndpoint =
  import.meta.env.VITE_DEFAULT_API_ENDPOINT || customAPIEndpoint;

