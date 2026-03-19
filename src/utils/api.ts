export const isAzureEndpoint = (endpoint: string) => {
  return endpoint.includes('openai.azure.com');
};

export const isMiniMaxEndpoint = (endpoint: string) => {
  return endpoint.includes('api.minimax.io') || endpoint.includes('api.minimaxi.com');
};

export const isMiniMaxModel = (model: string) => {
  return model.startsWith('MiniMax-');
};

export const clampMiniMaxTemperature = (temperature: number): number => {
  if (temperature <= 0) return 0.01;
  if (temperature > 1) return 1;
  return temperature;
};
