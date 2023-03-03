import React, { useEffect } from 'react';
import useStore from '@store/store';

const useSaveToLocalStorage = () => {
  const chats = useStore((state) => state.chats);

  useEffect(() => {
    if (chats) localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);
};

export default useSaveToLocalStorage;
