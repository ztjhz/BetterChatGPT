import React from 'react';
import { useTranslation } from 'react-i18next';

import PlusIcon from '@icon/PlusIcon';

import useAddChat from '@hooks/useAddChat';

const NewChat = () => {
  const { t } = useTranslation();
  const addChat = useAddChat();

  return (
    <a
      className='max-md:hidden flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm md:mb-2 flex-shrink-0 md:border md:border-white/20'
      onClick={addChat}
    >
      <PlusIcon />{' '}
      <span className='hidden md:inline-flex text-white text-sm'>
        {t('newChat')}
      </span>
    </a>
  );
};

export default NewChat;
