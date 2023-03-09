import { LocalStorageInterface } from '@type/chat';

export const migrateV0 = (persistedState: LocalStorageInterface) => {
  persistedState.chats.forEach((chat) => (chat.titleSet = false));
};
