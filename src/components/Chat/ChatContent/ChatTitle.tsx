import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import useStore from '@store/store';
import ConfigMenu from '@components/ConfigMenu';
import { ChatInterface, ConfigInterface } from '@type/chat';
import { _defaultChatConfig } from '@constants/chat';

const ChatTitle = React.memo(() => {
  const { t } = useTranslation('model');
  const config = useStore(
    (state) =>
      state.chats &&
      state.chats.length > 0 &&
      state.currentChatIndex >= 0 &&
      state.currentChatIndex < state.chats.length
        ? state.chats[state.currentChatIndex].config
        : undefined,
    shallow
  );
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const setConfig = (config: ConfigInterface) => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    updatedChats[currentChatIndex].config = config;
    setChats(updatedChats);
  };

  // for migrating from old ChatInterface to new ChatInterface (with config)
  useEffect(() => {
    const chats = useStore.getState().chats;
    if (chats && chats.length > 0 && currentChatIndex !== -1 && !config) {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      updatedChats[currentChatIndex].config = { ..._defaultChatConfig };
      setChats(updatedChats);
    }
  }, [currentChatIndex]);

  return config ? (
    <>
      <div
        className='flex gap-x-4 gap-y-1 flex-wrap w-full items-center justify-center border-b border-black/10 bg-gray-50 p-3 dark:border-gray-900/50 dark:new-chat-dark text-gray-600 dark:text-gray-300 cursor-pointer'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <div className='text-center p-1 rounded-md bg-gray-300/20 dark:new-chat-light hover:bg-gray-300/50 dark:hover:new-chat-light-hover'>
          {t('model')}: {config.model}
        </div>
        <div className='text-center p-1 rounded-md bg-gray-300/20 dark:new-chat-light hover:bg-gray-300/50 dark:hover:new-chat-light-hover'>
          {t('token.label')}: {config.max_tokens}
        </div>
        <div className='text-center p-1 rounded-md bg-gray-300/20 dark:new-chat-light hover:bg-gray-300/50 dark:hover:new-chat-light-hover'>
          {t('temperature.label')}: {config.temperature}
        </div>
        <div className='text-center p-1 rounded-md bg-gray-300/20 dark:new-chat-light hover:bg-gray-300/50 dark:hover:new-chat-light-hover'>
          {t('topP.label')}: {config.top_p}
        </div>
        <div className='text-center p-1 rounded-md bg-gray-300/20 dark:new-chat-light hover:bg-gray-300/50 dark:hover:new-chat-light-hover'>
          {t('presencePenalty.label')}: {config.presence_penalty}
        </div>
        <div className='text-center p-1 rounded-md bg-gray-300/20 dark:new-chat-light hover:bg-gray-300/50 dark:hover:new-chat-light-hover'>
          {t('frequencyPenalty.label')}: {config.frequency_penalty}
        </div>
      </div>
      {isModalOpen && (
        <ConfigMenu
          setIsModalOpen={setIsModalOpen}
          config={config}
          setConfig={setConfig}
        />
      )}
    </>
  ) : (
    <></>
  );
});

export default ChatTitle;
