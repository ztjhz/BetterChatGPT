import React from 'react';
import useStore from '@store/store';
import { defaultChatConfig, defaultSystemMessage } from '@constants/chat';
import { ChatInterface } from '@type/chat';

const useAddChat = () => {
  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  const addChat = () => {
    const chats = useStore.getState().chats;
    if (chats) {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      let titleIndex = 1;
      let title = `New Chat ${titleIndex}`;

      while (chats.some((chat) => chat.title === title)) {
        titleIndex += 1;
        title = `New Chat ${titleIndex}`;
      }

      updatedChats.unshift({
        title,
        messages: [{ role: 'system', content: defaultSystemMessage }],
        config: { ...defaultChatConfig },
      });
      setChats(updatedChats);
      setCurrentChatIndex(0);
    }
  };

  return addChat;
};

export default useAddChat;
