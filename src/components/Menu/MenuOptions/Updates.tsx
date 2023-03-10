import React from 'react';
import LinkIcon from '@icon/LinkIcon';

const Updates = ({ isButton = false }: { isButton?: boolean }) => {
  return (
    <a
      href='https://github.com/ztjhz/chatgpt-free-app'
      target='_blank'
      className={
        isButton
          ? 'flex py-3 px-3 items-center gap-3 transition-colors duration-200 btn btn-neutral text-sm justify-center'
          : 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
      }
    >
      <LinkIcon />
      Source Code
    </a>
  );
};

export default Updates;
