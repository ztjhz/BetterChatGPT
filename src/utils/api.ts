export const isAzureEndpoint = (endpoint: string) => {
  try {
    const url = new URL(endpoint);
    return url.hostname === 'gateway.ai.cloudflare.com';
  } catch (e) {
    return false;
  }
};
