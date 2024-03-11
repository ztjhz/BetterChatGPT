import { v4 as uuidv4 } from 'uuid';
import { ChatInterface, ConfigInterface, ModelOptions } from '@type/chat';
import useStore from '@store/store';

const date = new Date();
const dateString =
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2);

export const _defaultSystemMessage =
  import.meta.env.VITE_DEFAULT_SYSTEM_MESSAGE ??
  `You are T1A-ChatGPT, a large language model trained by OpenAI, whose service provided by T1A.
   Carefully follow the user's instructions. Respond using Markdown. Respond briefly, elaborate further when asked.
   If requested for code, only give that code, withold explanations until requested.
   If requested for code modification, lean towards only giving the relevant or changed snippets of code. But be ready to provide a complete sample when requested.
   When the conversation became lengthy and the accumulated context unneccessary consumes tokens, suggest the user to restart the converation in a new Chat and provide the current summary of context.`;

export const modelOptions: ModelOptions[] = [
  'gpt-3.5-turbo',
  'gpt-4',
  'gpt-4-turbo-preview'
];

export const defaultModel: ModelOptions = 'gpt-4-turbo-preview';

export const defaultTitleGenModel: ModelOptions = 'gpt-3.5-turbo';

export const modelMaxToken = {
  'gpt-3.5-turbo': 16385,
  'gpt-4': 8192,
  'gpt-4-turbo-preview': 128000
};

export const modelCost = {
  'gpt-3.5-turbo': {
    prompt: { price: 0.0005, unit: 1000 },
    completion: { price: 0.0015, unit: 1000 },
  },
  'gpt-4': {
    prompt: { price: 0.030, unit: 1000 },
    completion: { price: 0.060, unit: 1000 },
  },
  'gpt-4-turbo-preview': {
    prompt: { price: 0.010, unit: 1000 },
    completion: { price: 0.030, unit: 1000 },
  }
};

export const defaultUserMaxToken = 8000;

export const _defaultChatConfig: ConfigInterface = {
  model: defaultModel,
  max_tokens: defaultUserMaxToken,
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
