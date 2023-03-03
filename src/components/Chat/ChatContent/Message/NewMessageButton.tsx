import React from 'react';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';

import { ChatInterface, MessageInterface } from '@type/chat';
import { defaultSystemMessage } from '@constants/chat';

const NewMessageButton = ({ messageIndex }: { messageIndex: number }) => {
  const [
    messages,
    chats,
    setMessages,
    currentChatIndex,
    setChats,
    setCurrentChatIndex,
  ] = useStore((state) => [
    state.messages,
    state.chats,
    state.setMessages,
    state.currentChatIndex,
    state.setChats,
    state.setCurrentChatIndex,
  ]);

  const addChat = () => {
    if (chats) {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      updatedChats.unshift({
        title: `Chat ${Math.random()}`,
        messages: [{ role: 'system', content: defaultSystemMessage }],
      });
      setChats(updatedChats);
      setMessages(updatedChats[0].messages);
      setCurrentChatIndex(0);
    }
  };

  const addMessage = () => {
    if (currentChatIndex === -1) {
      addChat();
    } else {
      const updatedMessages: MessageInterface[] = JSON.parse(
        JSON.stringify(messages)
      );
      updatedMessages.splice(messageIndex + 1, 0, {
        content: '',
        role: 'user',
      });
      setMessages(updatedMessages);
    }
  };

  return (
    <div className='h-0 relative' key={messageIndex}>
      <div
        className='absolute top-0 right-0 translate-x-1/2 translate-y-[-50%] text-gray-600 dark:text-white cursor-pointer bg-gray-200 dark:bg-gray-600/80 rounded-full p-1 text-sm hover:bg-gray-300 dark:hover:bg-gray-800/80 transition-bg duration-200'
        onClick={addMessage}
      >
        <PlusIcon />
      </div>
    </div>
  );
};

export default NewMessageButton;
