export const officialAPIEndpoint = 'https://api.openai.com/v1/chat/completions';
const customAPIEndpoint =
  import.meta.env.VITE_CUSTOM_API_ENDPOINT || 'https://tan-proxy-7io2un3kuq-uw.a.run.app/v1/';


  // Below line is hardcoded to my proxy. Replace url with officialAPIEndpoint
export const defaultAPIEndpoint =
  import.meta.env.VITE_DEFAULT_API_ENDPOINT || 'https://tan-proxy-7io2un3kuq-uw.a.run.app/v1/';

export const availableEndpoints = [officialAPIEndpoint, customAPIEndpoint];
