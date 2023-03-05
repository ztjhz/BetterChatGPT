import React from 'react';

import ChatContent from './ChatContent';
import MobileBar from '../MobileBar';
import StopGeneratingButton from '@components/StopGeneratingButton/StopGeneratingButton';

const Chat = () => {
  return (
    <div className='flex h-full flex-1 flex-col md:pl-[260px]'>
      <MobileBar />
      <main className='relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1'>
        <ChatContent />
        <StopGeneratingButton />
      </main>
    </div>
  );
};

export default Chat;
