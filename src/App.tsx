import React, { useEffect } from 'react';
import useStore from '@store/store';
import i18n from './i18n';

import Chat from '@components/Chat';
import Menu from '@components/Menu';

import useInitialiseNewChat from '@hooks/useInitialiseNewChat';
import { ChatInterface } from '@type/chat';
import { Theme } from '@type/theme';
import ApiPopup from '@components/ApiPopup';
import Toast from '@components/Toast';

function App() {
  const initialiseNewChat = useInitialiseNewChat();
  const setChats = useStore((state) => state.setChats);
  const setTheme = useStore((state) => state.setTheme);
  const setApiKey = useStore((state) => state.setApiKey);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  const urlChatTitle = window.location.hash.substring(1);
  
  const findChatIndexByTitle = (chats: ChatInterface[], title: string) => {
    return chats.findIndex((chat) => chat.title === title);
  }
  
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    i18n.on('languageChanged', (lng) => {
      document.documentElement.lang = lng;
    });
  }, []);

  useEffect(() => {
    // legacy local storage
    const oldChats = localStorage.getItem('chats');
    const apiKey = localStorage.getItem('apiKey');
    const theme = localStorage.getItem('theme');

    if (apiKey) {
      // legacy local storage
      setApiKey(apiKey);
      localStorage.removeItem('apiKey');
    }

    if (theme) {
      // legacy local storage
      setTheme(theme as Theme);
      localStorage.removeItem('theme');
    }

    if (oldChats) {
      try {
        const chats: ChatInterface[] = JSON.parse(oldChats);
        if (chats.length > 0) {
          chatIndexToSet = urlChatTitle ? findChatIndexByTitle(chats, urlChatTitle) : 0;
          setChats(chats);
          setCurrentChatIndex(chatIndexToSet !== -1 ? chatIndexToSet : 0);
        } else {
          initialiseNewChat();
        }
      } catch (e: unknown) {
        console.log(e);
        initialiseNewChat();
      }
    
      localStorage.removeItem('chats');
    } else if (chatsFromStore && chatsFromStore.length > 0) {
      chatIndexToSet = urlChatTitle ? findChatIndexByTitle(chatsFromStore, urlChatTitle) : 0;
      if (chatIndexToSet !== -1) {
        setCurrentChatIndex(chatIndexToSet);
      }
    } else {
      initialiseNewChat();
    }
  }, []);

  return (
    <div className='overflow-hidden w-full h-full relative'>
      <Menu />
      <Chat />
      <ApiPopup />
      <Toast />
    </div>
  );
}

export default App;
