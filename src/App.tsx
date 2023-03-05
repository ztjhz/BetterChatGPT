import React, { useEffect, useRef } from 'react';
import useStore from '@store/store';

import Chat from './components/Chat';
import Menu from './components/Menu';
import ConfigMenu from './components/ConfigMenu';

import useInitialiseNewChat from '@hooks/useInitialiseNewChat';

function App() {
  const initialiseNewChat = useInitialiseNewChat();

  useEffect(() => {
    const chats = useStore.getState().chats;
    if (!chats || chats.length === 0) {
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
