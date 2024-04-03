import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import { ChatInterface } from '@type/chat';

import TickIcon from '@icon/TickIcon';

import CloneIcon from '@icon/CloneIcon';
import { handleNewMessageDraftBufferPersist } from '@utils/handleNewMessageDraftsPersistence';

const CloneChat = React.memo(() => {
  const { t } = useTranslation();

  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const setNewMessageDraftBuffer = useStore((state) => state.setNewMessageDraftBuffer);

  const generating = useStore((state) => state.generating);

  const setToastStatus = useStore((state) => state.setToastStatus);
  const setToastMessage = useStore((state) => state.setToastMessage);
  const setToastShow = useStore((state) => state.setToastShow);


  
  const cloneChat = () => {

    //persist new message draft buffer where it belonged to
    handleNewMessageDraftBufferPersist("cloneChat"); 

    const chats = useStore.getState().chats;

    if (chats) {
      const index = useStore.getState().currentChatIndex;
      let title = `Copy of ${chats[index].title}`;
      let i = 0;

      while (chats.some((chat) => chat.title === title)) {
        i += 1;
        title = `Copy ${i} of ${chats[index].title}`;
      }

      const clonedChat = JSON.parse(JSON.stringify(chats[index]));
      clonedChat.title = title;

      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      updatedChats.unshift(clonedChat);

      setChats(updatedChats);

      setNewMessageDraftBuffer("", 0);    // clear the new message draft buffer for new chat
      setCurrentChatIndex(0);

      setToastStatus('success');
      setToastMessage(t('cloned'));
      setToastShow(true);
    
    }
  };

  return (
    <>
      <button
        className={`flex btn py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white text-sm mb-2 flex-shrink-0 border border-white/20 transition-opacity ${
          generating
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer opacity-100'
        }`}
        aria-label={t('cloneChat') as string}
        onClick={cloneChat}
        title={t('cloneChat') || "Clone Chat"}
      >
        <CloneIcon/>
      </button>
    </>

  );
});

export default CloneChat;
