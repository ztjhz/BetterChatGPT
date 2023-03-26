import React from 'react';
import { useTranslation } from 'react-i18next';

import HeartIcon from '@icon/HeartIcon';

const Me = () => {
  const { t } = useTranslation();
  return (
    <a
      className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
      href='https://github.com/pbk123461/ChatGPT'
      target='_blank'
    >
      <HeartIcon />
      {t('Made by Jing Hua. This website is published by pbk123461')}
    </a>
  );
};

export default Me;
