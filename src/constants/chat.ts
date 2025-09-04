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
  'llama3.2-vision:90b',
  'qwen2.5-coder:32b',
  'deepseek-r1:32b',
  'qwen2.5:14b',
];

export const defaultModel = 'qwen2.5:14b';

export const modelMaxToken = {
  'llama3.2-vision:90b': 128000,
  'qwen2.5-coder:32b': 128000,
  'deepseek-r1:32b': 128000,
  'qwen2.5:14b': 32768,
};

export const modelCost = {
  'llama3.2-vision:90b': {
    prompt: { price: 0, unit: 1000 },
    completion: { price: 0, unit: 1000 },
  },
  'qwen2.5-coder:32b': {
    prompt: { price: 0, unit: 1000 },
    completion: { price: 0, unit: 1000 },
  },
  'deepseek-r1:32b': {
    prompt: { price: 0, unit: 1000 },
    completion: { price: 0, unit: 1000 },
  },
  'qwen2.5:14b': {
    prompt: { price: 0, unit: 1000 },
    completion: { price: 0, unit: 1000 },
  },
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
