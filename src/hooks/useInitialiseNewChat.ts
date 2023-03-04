import React from 'react';
import useStore from '@store/store';
import { MessageInterface } from '@type/chat';
import { defaultSystemMessage } from '@constants/chat';

const useInitialiseNewChat = () => {
  const [setChats, setMessages, setCurrentChatIndex] = useStore((state) => [
    state.setChats,
    state.setMessages,
    state.setCurrentChatIndex,
  ]);

  const initialiseNewChat = () => {
    const message: MessageInterface = {
      role: 'system',
      content: defaultSystemMessage,
    };
    setChats([
      {
        title: 'New Chat',
        messages: [message],
      },
    ]);
    setMessages([message]);
    setCurrentChatIndex(0);
  };

  return initialiseNewChat;
};

export default useInitialiseNewChat;
