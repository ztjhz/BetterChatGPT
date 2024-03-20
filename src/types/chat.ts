import { Prompt } from './prompt';
import { Theme } from './theme';

export type Role = 'user' | 'assistant' | 'system';
export const roles: Role[] = ['user', 'assistant', 'system'];

export interface MessageInterface {
  role: Role;
  content: string;
  model?: ModelOptions; //Only applicable to Assistant: which model generated the message;
}

export interface ChatInterface {
  id: string;
  title: string;
  folder?: string;
  messages: MessageInterface[];
  config: ConfigInterface;
  titleSet: boolean;
}

export interface ConfigInterface {
  model: ModelOptions;
  maxPromptTokens: number,
  maxGenerationTokens: number;
  temperature: number;
  presence_penalty: number;
  top_p: number;
  frequency_penalty: number;
}

export interface ChatHistoryInterface {
  title: string;
  index: number;
  id: string;
}

export interface ChatHistoryFolderInterface {
  [folderId: string]: ChatHistoryInterface[];
}

export interface FolderCollection {
  [folderId: string]: Folder;
}

export interface Folder {
  id: string;
  name: string;
  expanded: boolean;
  order: number;
  color?: string;
}

export type ModelOptions =
  'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4-turbo-preview'
  | 'claude-3-haiku'
  | 'claude-3-sonnet'
  | 'claude-3-opus';

export interface ModelDetails {
  maxModelTokens: number;
  displayName: string;
  apiAliasCurrent: string;
  portkeyProvider: string;
  titleGenModel: ModelOptions;  
            /* Which model to use for chats title generation. 
                Should be cheapest fastest option from the same provider - in case current API Keys situation may not allow to talk to another provider */
  cost: {
    prompt: { price: number; unit: number };
    completion: { price: number; unit: number };
  };
}

export type ModelsList = {
  [model in ModelOptions]: ModelDetails;
};

export type TotalTokenUsed = {
  [model in ModelOptions]?: {
    promptTokens: number;
    completionTokens: number;
  };
};

export interface LocalStorageInterfaceV0ToV1 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  theme: Theme;
}

export interface LocalStorageInterfaceV1ToV2 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
}

export interface LocalStorageInterfaceV2ToV3 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
}
export interface LocalStorageInterfaceV3ToV4 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
}

export interface LocalStorageInterfaceV4ToV5 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
}

export interface LocalStorageInterfaceV5ToV6 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
}

export interface LocalStorageInterfaceV6ToV7 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiFree?: boolean;
  apiKey: string;
  apiEndpoint: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
  defaultChatConfig: ConfigInterface;
  defaultSystemMessage: string;
  hideMenuOptions: boolean;
  firstVisit: boolean;
  hideSideMenu: boolean;
}

export interface LocalStorageInterfaceV7oV8
  extends LocalStorageInterfaceV6ToV7 {
  foldersName: string[];
  foldersExpanded: boolean[];
  folders: FolderCollection;
}

export interface LocalStorageInterfaceV8oV9
  extends LocalStorageInterfaceV7oV8 {

}