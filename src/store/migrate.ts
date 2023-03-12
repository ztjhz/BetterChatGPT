import {
  LocalStorageInterfaceV0ToV1,
  LocalStorageInterfaceV1ToV2,
} from '@type/chat';
import { defaultChatConfig } from '@constants/chat';
import { defaultAPIEndpoint, officialAPIEndpoint } from '@constants/auth';

export const migrateV0 = (persistedState: LocalStorageInterfaceV0ToV1) => {
  persistedState.chats.forEach((chat) => {
    chat.titleSet = false;
    if (!chat.config) chat.config = { ...defaultChatConfig };
  });
};

export const migrateV1 = (persistedState: LocalStorageInterfaceV1ToV2) => {
  if (persistedState.apiFree) {
    persistedState.apiEndpoint = persistedState.apiFreeEndpoint;
  } else {
    persistedState.apiEndpoint = officialAPIEndpoint;
  }
};
