import React, { useEffect } from 'react';
import useStore from '@store/store';
import { ChatInterface, MessageInterface } from '@type/chat';

const useUpdateCharts = () => {
  const [chats, messages, setChats, currentChatIndex] = useStore((state) => [
    state.chats,
    state.messages,
    state.setChats,
    state.currentChatIndex,
  ]);

  useEffect(() => {
    if (currentChatIndex !== -1 && chats && chats.length > 0) {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      const updatedMessages: MessageInterface[] = JSON.parse(
        JSON.stringify(messages)
      );
      updatedChats[currentChatIndex].messages = updatedMessages;
      setChats(updatedChats);
    }
  }, [messages]);
};

export default useUpdateCharts;
