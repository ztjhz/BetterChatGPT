import React from 'react';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';

import { ChatInterface } from '@type/chat';
import { generateDefaultChat } from '@constants/chat';

const NewMessageButton = React.memo(
  ({ messageIndex }: { messageIndex: number }) => {
    const setChats = useStore((state) => state.setChats);
    const currentChatIndex = useStore((state) => state.currentChatIndex);
    const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
    const blockFilter = useStore((state) => state.blockFilter); // Get the current filter

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

        updatedChats.unshift(generateDefaultChat(title));
        setChats(updatedChats);
        setCurrentChatIndex(0);
      }
    };
    
    const addMessage = () => {
      const chats = useStore.getState().chats;
      // Ensure that chats is defined before proceeding
      if (!chats || chats.length === 0 || currentChatIndex === -1) {
        addChat();
        return; // Return early to avoid executing the rest of the code since addChat() will handle the necessary logic
      }
    
      // At this point, we're guaranteed that chats is not undefined, so we can safely access it
      const currentChat = chats[currentChatIndex];
      if (!currentChat) return;
    
      const realIndex = messageIndex + 1; // Use the messageIndex prop directly to determine the insertion point
    
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      updatedChats[currentChatIndex].messages.splice(realIndex, 0, {
        content: '',
        role: 'user',
      });
      setChats(updatedChats);
    };
    
 

    return (
      <div
        className='h-0 w-0 relative'
        key={messageIndex}
        aria-label='insert message'
      >
        <div
          className='absolute top-0 right-0 translate-x-1/2 translate-y-[-50%] text-gray-600 dark:text-white cursor-pointer bg-gray-200 dark:bg-gray-600/80 rounded-full p-1 text-sm hover:bg-gray-300 dark:hover:bg-gray-800/80 transition-bg duration-200'
          onClick={addMessage}
        >
          <PlusIcon />
        </div>
      </div>
    );
  }
);

export default NewMessageButton;
