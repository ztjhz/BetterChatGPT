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

// default system message obtained using the following method: https://twitter.com/DeminDimin/status/1619935545144279040
export const _defaultSystemMessage =
  import.meta.env.VITE_DEFAULT_SYSTEM_MESSAGE ??
  `You are ChatGPT, a large language model trained by OpenAI.
Carefully heed the user's instructions. 
Respond using Markdown.`;

export const modelOptions: ModelOptions[] = [
  'gpt-4',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-16k',
  //'bard',
  'sage',
  'claude-instant',
  'claude+',
  'claude-instant-100k',
  'gpt-4-poe',
  'gpt-3.5-turbo-poe',
];

export const defaultModel = 'gpt-3.5-turbo';

export const modelMaxToken = {
  'gpt-4': 8000,
  'gpt-3.5-turbo': 4097,
  'gpt-3.5-turbo-0613': 4000,
  'gpt-3.5-turbo-16k': 16000,
  //'bard': 10000,
  'sage': 5200,
  'claude-instant': 11000,
  'claude+': 11000,
  'claude-instant-100k': 100000,
  'gpt-4-poe': 2100,
  'gpt-3.5-turbo-poe': 2800,
};

export const modelCost = {
  'gpt-3.5-turbo': {
    prompt: { price: 0.002, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },

  'gpt-4': {
    prompt: { price: 0.03, unit: 1000 },
    completion: { price: 0.06, unit: 1000 },
  },
  'gpt-3.5-turbo-poe': {
    prompt: { price: 0.002, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },
  'gpt-3.5-turbo-0613': {
    prompt: { price: 0.002, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },
  'gpt-3.5-turbo-16k': {
    prompt: { price: 0.002, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },

  'gpt-4-poe': {
    prompt: { price: 0.03, unit: 1000 },
    completion: { price: 0.06, unit: 1000 },
  },
  'sage': {
    prompt: { price: 0.002, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },

  'claude-instant': {
    prompt: { price: 0.002, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },
  'claude+': {
    prompt: { price: 0.002, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },

  'claude-instant-100k': {
    prompt: { price: 0.002, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },
  // 'bard': {
  //   prompt: { price: 0.002, unit: 1000 },
  //   completion: { price: 0.002, unit: 1000 },
  // },
};

export const defaultUserMaxToken = 4000;

export const _defaultChatConfig: ConfigInterface = {
  model: defaultModel,
  max_tokens: defaultUserMaxToken,
  temperature: 1,
  presence_penalty: 0,
  top_p: 1,
  frequency_penalty: 0,
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
