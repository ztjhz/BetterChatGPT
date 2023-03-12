import { LocalStorageInterface } from '@type/chat';
import { defaultChatConfig } from '@constants/chat';

export const migrateV0 = (persistedState: LocalStorageInterface) => {
  persistedState.chats.forEach((chat) => {
    chat.titleSet = false;
    if (!chat.config) chat.config = { ...defaultChatConfig };
  });
};
