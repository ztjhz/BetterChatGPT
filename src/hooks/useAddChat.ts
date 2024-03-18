import React from 'react';
import useStore from '@store/store';
import { generateDefaultChat } from '@constants/chat';
import { ChatInterface, ModelOptions } from '@type/chat';

const useAddChat = () => {
  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  const addChat = (folder?: string, model?: ModelOptions) => { // Added optional model parameter
    const chats = useStore.getState().chats;
    if (chats) {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      let titleIndex = 1;
      let title = `New Chat ${titleIndex}`;

      while (chats.some((chat) => chat.title === title)) {
        titleIndex += 1;
        title = `New Chat ${titleIndex}`;
      }

      const newChat = generateDefaultChat(title, folder);
      if (model) {
        newChat.config = { ...newChat.config, model };
        //console.log(newChat)
      }  

      updatedChats.unshift(newChat);
      setChats(updatedChats);
      setCurrentChatIndex(0);
    }
  };

  return addChat;
};

export default useAddChat;
