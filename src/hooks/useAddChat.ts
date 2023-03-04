import React from 'react';
import useStore from '@store/store';
import { defaultSystemMessage } from '@constants/chat';
import { ChatInterface } from '@type/chat';

const useAddChat = () => {
  const [chats, setChats, setCurrentChatIndex, setMessages] = useStore(
    (state) => [
      state.chats,
      state.setChats,
      state.setCurrentChatIndex,
      state.setMessages,
    ]
  );

  const addChat = () => {
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
      });
      setChats(updatedChats);
      setMessages(updatedChats[0].messages);
      setCurrentChatIndex(0);
    }
  };

  return addChat;
};

export default useAddChat;
