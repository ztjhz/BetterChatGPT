export const isAzureEndpoint = (endpoint: string) => {
  return endpoint.indexOf('gateway.ai.cloudflare.com') !== -1;
};
