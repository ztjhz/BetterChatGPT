import { ChatInterface } from '@type/chat';
import { roles } from '@type/chat';

export const isChats = (chats: any): chats is ChatInterface[] => {
  if (!Array.isArray(chats)) return false;

  for (const chat of chats) {
    if (!(typeof chat.title === 'string') || chat.title === '') return false;
    if (!(typeof chat.titleSet === 'boolean')) return false;

    if (!Array.isArray(chat.messages)) return false;
    for (const message of chat.messages) {
      if (!(typeof message.content === 'string')) return false;
      if (!(typeof message.role === 'string')) return false;
      if (!roles.includes(message.role)) return false;
    }

    if (!(typeof chat.config === 'object')) return false;
    if (!(typeof chat.config.temperature === 'number')) return false;
    if (!(typeof chat.config.presence_penalty === 'number')) return false;
  }

  return true;
};
