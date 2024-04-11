export const isAzureEndpoint = (endpoint: string) => {
  return endpoint.includes('gateway.ai.cloudflare.com');
};
