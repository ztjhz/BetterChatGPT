import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';

import useAddChat from '@hooks/useAddChat';

const NewChat = ({ folder='', compact=false }) => {
  const { t } = useTranslation();
  const addChat = useAddChat();
  const generating = useStore((state) => state.generating);

  return (
    <a
      className={`flex items-center ${
        compact ? 'py-1 px-1 gap-1 justify-center' : 'max-md:hidden py-3 px-3 gap-3'
      } rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white text-sm md:mb-2 flex-shrink-0 md:border md:border-white/20 transition-opacity ${
        generating
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer opacity-100'
      }`}
      onClick={() => {
        if (!generating) addChat(folder);
      }}
      title={compact ? String(t('newChat')) : ''}
    >
      <PlusIcon />
      {compact || (
        <>
          {' '}
          <span className='hidden md:inline-flex text-white text-sm'>
            {t('newChat')}
          </span>
        </>
      )}
    </a>
  );
};

export default NewChat;
