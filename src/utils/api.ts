export const isAzureEndpoint = (endpoint: string) => {
  return endpoint.includes('openai.azure.com');
};
