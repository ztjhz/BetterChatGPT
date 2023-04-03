import { v4 as uuidv4 } from 'uuid';

import {
  ChatInterface,
  ConfigInterface,
  FolderCollection,
  MessageInterface,
} from '@type/chat';
import { roles } from '@type/chat';
import {
  defaultModel,
  modelOptions,
  _defaultChatConfig,
} from '@constants/chat';
import { ExportV1 } from '@type/export';

export const validateAndFixChats = (chats: any): chats is ChatInterface[] => {
  if (!Array.isArray(chats)) return false;

  for (const chat of chats) {
    if (!(typeof chat.id === 'string')) chat.id = uuidv4();
    if (!(typeof chat.title === 'string') || chat.title === '') return false;

    if (chat.titleSet === undefined) chat.titleSet = false;
    if (!(typeof chat.titleSet === 'boolean')) return false;

    if (!validateMessage(chat.messages)) return false;
    if (!validateAndFixChatConfig(chat.config)) return false;
  }

  return true;
};

const validateMessage = (messages: MessageInterface[]) => {
  if (!Array.isArray(messages)) return false;
  for (const message of messages) {
    if (!(typeof message.content === 'string')) return false;
    if (!(typeof message.role === 'string')) return false;
    if (!roles.includes(message.role)) return false;
  }
  return true;
};

const validateAndFixChatConfig = (config: ConfigInterface) => {
  if (config === undefined) config = _defaultChatConfig;
  if (!(typeof config === 'object')) return false;

  if (!config.temperature) config.temperature = _defaultChatConfig.temperature;
  if (!(typeof config.temperature === 'number')) return false;

  if (!config.presence_penalty)
    config.presence_penalty = _defaultChatConfig.presence_penalty;
  if (!(typeof config.presence_penalty === 'number')) return false;

  if (!config.top_p) config.top_p = _defaultChatConfig.top_p;
  if (!(typeof config.top_p === 'number')) return false;

  if (!config.frequency_penalty)
    config.frequency_penalty = _defaultChatConfig.frequency_penalty;
  if (!(typeof config.frequency_penalty === 'number')) return false;

  if (!config.model) config.model = defaultModel;
  if (!modelOptions.includes(config.model)) return false;

  return true;
};

export const isLegacyImport = (importedData: any) => {
  if (Array.isArray(importedData)) return true;
  return false;
};

export const validateFolders = (
  folders: FolderCollection
): folders is FolderCollection => {
  if (typeof folders !== 'object') return false;

  for (const folderId in folders) {
    if (typeof folders[folderId].id !== 'string') return false;
    if (typeof folders[folderId].name !== 'string') return false;
    if (typeof folders[folderId].order !== 'number') return false;
    if (typeof folders[folderId].expanded !== 'boolean') return false;
  }

  return true;
};

export const validateExportV1 = (data: ExportV1): data is ExportV1 => {
  return validateAndFixChats(data.chats) && validateFolders(data.folders);
};
