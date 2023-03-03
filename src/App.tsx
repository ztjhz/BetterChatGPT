import React, { useEffect } from 'react';
import useStore from '@store/store';

import Chat from './components/Chat';
import Menu from './components/Menu';
import ConfigMenu from './components/ConfigMenu';

import useSaveToLocalStorage from '@hooks/useSaveToLocalStorage';
import useUpdateCharts from '@hooks/useUpdateChats';

import { ChatInterface } from '@type/chat';

function App() {
  useSaveToLocalStorage();
  useUpdateCharts();

  const [setChats, setMessages, setCurrentChatIndex] = useStore((state) => [
    state.setChats,
    state.setMessages,
    state.setCurrentChatIndex,
  ]);

  useEffect(() => {
    // localStorage.removeItem('chats');
    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      try {
        const chats: ChatInterface[] = JSON.parse(storedChats);
        setChats(chats);
        setMessages(chats[0].messages);
        setCurrentChatIndex(0);
      } catch (e: unknown) {
        setChats([]);
        setMessages([]);
        setCurrentChatIndex(-1);
        console.log(e);
      }
    } else {
      setChats([]);
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
