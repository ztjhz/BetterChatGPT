import React from 'react';
import useStore from '@store/store';

import ChatContent from './ChatContent';
import MobileBar from '../MobileBar';
import StopGeneratingButton from '@components/StopGeneratingButton/StopGeneratingButton';
import HorizontalMenu from '@components/HorizontalMenu/menu';

const Chat = () => {
  const hideSideMenu = useStore((state) => state.hideSideMenu);

  return (
    <div
      className={`flex h-full flex-1 flex-col ${
        hideSideMenu ? 'md:pl-0' : 'md:pl-[260px]'
      }`}
    >
      <MobileBar />
      <main className='relative bg-gray-50 h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1'>
        <HorizontalMenu />
        <ChatContent />
        <StopGeneratingButton />
      </main>
    </div>
  );
};

export default Chat;
