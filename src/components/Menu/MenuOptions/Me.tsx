import React from 'react';

import HeartIcon from '@icon/HeartIcon';

const Me = () => {
  return (
    <a
      className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
      href='https://github.com/ztjhz'
      target='_blank'
    >
      <HeartIcon />
      Made by Jing Hua
    </a>
  );
};

export default Me;
