import React, { useState } from 'react';
import useStore from '@store/store';

import PersonIcon from '@icon/PersonIcon';

const Config = () => {
  const apiFree = useStore((state) => state.apiFree);
  const setOpenConfig = useStore((state) => state.setOpenConfig);

  return (
    <a
      className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
      onClick={() => setOpenConfig(true)}
    >
      <PersonIcon />
      API: {apiFree ? 'Free' : 'Personal'}
    </a>
  );
};

export default Config;
