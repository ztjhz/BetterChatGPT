import React from 'react';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';

import { ChatInterface } from '@type/chat';
import { defaultSystemMessage } from '@constants/chat';

const NewChat = () => {
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

  return (
    <a
      className='max-md:hidden flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm md:mb-2 flex-shrink-0 md:border md:border-white/20'
      onClick={addChat}
    >
      <PlusIcon />{' '}
      <span className='hidden md:inline-flex text-white text-sm'>New chat</span>
    </a>
  );
};

export default NewChat;
