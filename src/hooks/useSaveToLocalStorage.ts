import React, { useEffect, useRef } from 'react';
import useStore from '@store/store';

const useSaveToLocalStorage = () => {
  const chatsRef = useRef(useStore.getState().chats);

  useEffect(() => {
    const unsubscribe = useStore.subscribe((state) => {
      if (chatsRef && chatsRef.current !== state.chats) {
        chatsRef.current = state.chats;
        localStorage.setItem('chats', JSON.stringify(state.chats));
      }
    });

    return unsubscribe;
  }, []);
};

export default useSaveToLocalStorage;
