import { v4 as uuidv4 } from 'uuid';
import { ChatInterface, ConfigInterface, ModelOptions, ModelsList } from '@type/chat';
import useStore from '@store/store';

const date = new Date();
const dateString =
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2);

const companyName:string = import.meta.env.VITE_COMPANY_NAME || "";

export const _defaultSystemMessage =
  import.meta.env.VITE_DEFAULT_SYSTEM_MESSAGE ??
  `You are ${companyName} Custom ChatGPT, a large language model trained by OpenAI, whose service is provided by ${companyName}.
   Carefully follow the user's instructions. Respond using Markdown. Respond briefly, elaborate further when asked.
   If asked for code writing, only give that code, withhold explanations until requested. If asked for code modification, only give the relevant or changed pieces of code - unless specifically requested provide a complete snippet, then comply.`;

export const defaultModel: ModelOptions = 'gpt-4-turbo-preview';

export const defaultTitleGenModel: ModelOptions = 'gpt-3.5-turbo';

export const supportedModels: ModelsList = {
  'gpt-3.5-turbo': {
    maxModelTokens: 16385,
    displayName: 'GPT-3.5',
    apiAliasCurrent: 'gpt-3.5-turbo',
    portkeyProvider: 'openai',
    titleGenModel: 'gpt-3.5-turbo',
    cost: {
      prompt: { price: 0.5, unit: 1000000 },
      completion: { price: 1.5, unit: 1000000 },
    },
  },
  'gpt-4': {
    maxModelTokens: 8192,
    displayName: 'GPT-4',
    apiAliasCurrent: 'gpt-4',
    portkeyProvider: 'openai',
    titleGenModel: 'gpt-3.5-turbo',
    cost: {
      prompt: { price: 30.00, unit: 1000000 },
      completion: { price: 60.00, unit: 1000000 },
    },
  },
  'gpt-4-turbo-preview': {
    maxModelTokens: 128000,
    displayName: 'GPT-4 Turbo',
    apiAliasCurrent: 'gpt-4-turbo-preview',
    portkeyProvider: 'openai',
    titleGenModel: 'gpt-3.5-turbo',
    cost: {
      prompt: { price: 10.00, unit: 1000000 },
      completion: { price: 30.00, unit: 1000000 },
    },
  },
  'claude-3-haiku': {
    maxModelTokens: 120000,
    displayName: 'Claude 3 Haiku',
    apiAliasCurrent: 'claude-3-haiku-20240307',
    portkeyProvider: 'anthropic',
    titleGenModel: 'gpt-3.5-turbo', /*TODO: change to claude-3-haiku after resolving the fetch issue with Apim/Portkey in the dev environment*/
    cost: {
      prompt: { price: 0.25, unit: 1000000 },
      completion: { price: 1.25, unit: 1000000 },
    },
  },
  'claude-3-sonnet': {
    maxModelTokens: 160000,
    displayName: 'Claude 3 Sonnet',
    apiAliasCurrent: 'claude-3-sonnet-20240229',
    portkeyProvider: 'anthropic',
    titleGenModel: 'gpt-3.5-turbo', /*TODO: change to claude-3-haiku after resolving the fetch issue with Apim/Portkey in the dev environment*/
    cost: {
      prompt: { price: 3.00, unit: 1000000 },
      completion: { price: 15.00, unit: 1000000 },
    },
  },
  'claude-3-opus': {
    maxModelTokens: 160000,
    displayName: 'Claude 3 Opus',
    apiAliasCurrent: 'claude-3-opus-20240229',
    portkeyProvider: 'anthropic',
    titleGenModel: 'gpt-3.5-turbo', /*TODO: change to claude-3-haiku after resolving the fetch issue with Apim/Portkey in the dev environment*/
    cost: {
      prompt: { price: 15.00, unit: 1000000 },
      completion: { price: 75.00, unit: 1000000 },
    },
  }
};

export const _defaultChatConfig: ConfigInterface = {
  model: defaultModel,
  maxPromptTokens: 8000,
  maxGenerationTokens: 4000,
  temperature: 0.3,
  presence_penalty: 0,
  top_p: 0.2,
  frequency_penalty: 0.1,
};

export const generateDefaultChat = (
  title?: string,
  folder?: string
): ChatInterface => ({
  id: uuidv4(),
  title: title ? title : 'New Chat',
  messages:
    useStore.getState().defaultSystemMessage.length > 0
      ? [{ role: 'system', content: useStore.getState().defaultSystemMessage }]
      : [],
  config: { ...useStore.getState().defaultChatConfig },
  titleSet: false,
  folder,
});

export const codeLanguageSubset = [
  'python',
  'javascript',
  'java',
  'go',
  'bash',
  'c',
  'cpp',
  'csharp',
  'css',
  'diff',
  'graphql',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objectivec',
  'perl',
  'php',
  'php-template',
  'plaintext',
  'python-repl',
  'r',
  'ruby',
  'rust',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'vbnet',
  'wasm',
  'xml',
  'yaml',
];
