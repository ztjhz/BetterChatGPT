import React from 'react';

import useStore from '@store/store';
import PlusIcon from '@icon/PlusIcon';
import useAddChat from '@hooks/useAddChat';

const MobileBar = () => {
  const chatTitle = useStore((state) =>
    state.chats && state.chats.length > 0
      ? state.chats[state.currentChatIndex].title
      : 'New Chat'
  );

  const addChat = useAddChat();

  return (
    <div className='sticky top-0 left-0 w-full z-50 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden'>
      <button
        type='button'
        className='-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white'
        onClick={() => {
          document
            .getElementById('menu')
            ?.classList.add('max-md:translate-x-[0%]');
          document.getElementById('menu-close')?.classList.remove('hidden');
          document.getElementById('menu-backdrop')?.classList.remove('hidden');
        }}
      >
        <span className='sr-only'>Open sidebar</span>
        <svg
          stroke='currentColor'
          fill='none'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='h-6 w-6'
          height='1em'
          width='1em'
          xmlns='http://www.w3.org/2000/svg'
        >
          <line x1='3' y1='12' x2='21' y2='12'></line>
          <line x1='3' y1='6' x2='21' y2='6'></line>
          <line x1='3' y1='18' x2='21' y2='18'></line>
        </svg>
      </button>
      <h1 className='flex-1 text-center text-base font-normal'>{chatTitle}</h1>
      <button type='button' className='px-3 text-gray-400' onClick={addChat}>
        <PlusIcon className='h-6 w-6' />
      </button>
    </div>
  );
};

export default MobileBar;
