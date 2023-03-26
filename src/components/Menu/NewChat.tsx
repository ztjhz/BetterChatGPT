import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';

import useAddChat from '@hooks/useAddChat';

const NewChat = () => {
  const { t } = useTranslation();
  const addChat = useAddChat();
  const generating = useStore((state) => state.generating);

  return (
    <a
      className={`max-md:hidden flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white text-sm md:mb-2 flex-shrink-0 md:border md:border-white/20 transition-opacity ${
        generating
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer opacity-100'
      }`}
      onClick={() => {
        if (!generating) addChat();
      }}
    >
      <PlusIcon />{' '}
      <span className='hidden md:inline-flex text-white text-sm'>
        {t('newChat')}
      </span>
    </a>
  );
};

export default NewChat;
