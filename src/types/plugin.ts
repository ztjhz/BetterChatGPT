export interface PluginDefinition {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  parameters: string;
  code: string;
}

export interface OpenAIFunctionDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ChatCompletionFunctionCall {
  name: string;
  arguments?: string;
}

export interface ChatCompletionMessage {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string | null;
  name?: string;
  function_call?: ChatCompletionFunctionCall;
}
