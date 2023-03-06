import React from 'react';
import useStore from '@store/store';
import { MessageInterface } from '@type/chat';
import { defaultChatConfig, defaultSystemMessage } from '@constants/chat';

const useInitialiseNewChat = () => {
  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  const initialiseNewChat = () => {
    const message: MessageInterface = {
      role: 'system',
      content: defaultSystemMessage,
    };
    setChats([
      {
        title: 'New Chat',
        messages: [message],
        config: { ...defaultChatConfig },
      },
    ]);
    setCurrentChatIndex(0);
  };

  return initialiseNewChat;
};

export default useInitialiseNewChat;
