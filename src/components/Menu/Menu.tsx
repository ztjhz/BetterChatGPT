import React from 'react';

import NewChat from './NewChat';
import ChatHistoryList from './ChatHistoryList';
import MenuOptions from './MenuOptions';
import CrossIcon2 from '@icon/CrossIcon2';

const Menu = () => {
  return (
    <div
      id='menu'
      className='dark bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col max-md:translate-x-[-100%] max-md:fixed max-md:transition-transform max-md:z-[999] max-md:top-0 max-md:left-0 max-md:h-full'
    >
      <div className='flex h-full min-h-0 flex-col '>
        <div className='scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20'>
          <nav className='flex h-full flex-1 flex-col space-y-1 p-2'>
            <NewChat />
            <ChatHistoryList />
            <MenuOptions />
          </nav>
        </div>
      </div>
      <div
        id='menu-close'
        className='hidden md:hidden absolute z-[999] right-0 translate-x-full top-10 bg-gray-900 p-2 cursor-pointer hover:bg-black text-white'
        onClick={() => {
          document
            .getElementById('menu')
            ?.classList.remove('max-md:translate-x-[0%]');
          document.getElementById('menu-close')?.classList.add('hidden');
        }}
      >
        <CrossIcon2 />
      </div>
    </div>
  );
};

export default Menu;
