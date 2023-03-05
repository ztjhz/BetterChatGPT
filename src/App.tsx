import React, { useEffect } from 'react';
import useStore from '@store/store';

import Chat from './components/Chat';
import Menu from './components/Menu';
import ConfigMenu from './components/ConfigMenu';

import useSaveToLocalStorage from '@hooks/useSaveToLocalStorage';
import useInitialiseNewChat from '@hooks/useInitialiseNewChat';

import { ChatInterface } from '@type/chat';

function App() {
  useSaveToLocalStorage();
  const initialiseNewChat = useInitialiseNewChat();

  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  useEffect(() => {
    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      try {
        const chats: ChatInterface[] = JSON.parse(storedChats);
        if (chats.length > 0) {
          setChats(chats);
          setCurrentChatIndex(0);
        } else {
          initialiseNewChat();
        }
      } catch (e: unknown) {
        setChats([]);
        setCurrentChatIndex(-1);
        console.log(e);
      }
    } else {
      initialiseNewChat();
    }
  }, []);

  return (
    <div className='overflow-hidden w-full h-full relative'>
      <Menu />
      <Chat />
      <ConfigMenu />
    </div>
  );
}

export default App;
