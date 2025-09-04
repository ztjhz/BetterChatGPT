export const litellmProxyEndpoint = 'https://litellmproxy-production.up.railway.app/chat/completions';
export const defaultAPIEndpoint =
  import.meta.env.VITE_DEFAULT_API_ENDPOINT || litellmProxyEndpoint;

export const availableEndpoints = [litellmProxyEndpoint];
