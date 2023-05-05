import React, { useEffect, useState } from 'react';
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleSignInWithGoogle = () => window.location.href = `/login`;

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    i18n.on('languageChanged', (lng) => {
      document.documentElement.lang = lng;
    });
  }, []);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      const apiEndpoint = import.meta.env.VITE_DEFAULT_API_ENDPOINT;
      const endpointUrl = new URL(apiEndpoint);
      endpointUrl.pathname = '/me';
      const response = await fetch(endpointUrl.toString(), {
        method: 'GET',
        credentials: 'include',
      });
      const isValidResponse = response.status === 200 

      setIsLoggedIn( isValidResponse );
    };
    checkLoggedInStatus();

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
      // legacy local storage
      try {
        const chats: ChatInterface[] = JSON.parse(oldChats);
        if (chats.length > 0) {
          setChats(chats);
          setCurrentChatIndex(0);
        } else {
          initialiseNewChat();
        }
      } catch (e: unknown) {
        console.log(e);
        initialiseNewChat();
      }
      localStorage.removeItem('chats');
    } else {
      // existing local storage
      const chats = useStore.getState().chats;
      const currentChatIndex = useStore.getState().currentChatIndex;
      if (!chats || chats.length === 0) {
        initialiseNewChat();
      }
      if (
        chats &&
        !(currentChatIndex >= 0 && currentChatIndex < chats.length)
      ) {
        setCurrentChatIndex(0);
      }
    }

  }, []);

  function Login(){
    return (
      <div className='flex items-center justify-center h-screen'>
        <button
          onClick={handleSignInWithGoogle}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Sign-In with Google
        </button>
      </div>
    );
  }

  function GPT(){
    return <>
      <Menu />
      <Chat />
      <ApiPopup />
      <Toast />
    </>
  }
  
  return (
    <div className='overflow-hidden w-full h-full relative'>
      {!isLoggedIn ? <Login /> : <GPT />}
    </div>
  );
}

export default App;