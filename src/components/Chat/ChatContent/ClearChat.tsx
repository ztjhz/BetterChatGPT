import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import { ChatInterface } from '@type/chat';
import { _defaultSystemMessage } from '@constants/chat';

const ClearChat = React.memo(() => {
  const { t } = useTranslation();

  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);

  const clearChat = () => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    updatedChats[currentChatIndex].messages = [{ role: 'system', content: useStore.getState().defaultSystemMessage }];
    setChats(updatedChats);
  };

  return (
    <button
      className='btn btn-neutral flex gap-1'
      aria-label={t('clearThisConversation') as string}
      onClick={clearChat}
    >
      {t('resetThisConversation')}
    </button>
  );
});

export default ClearChat;
