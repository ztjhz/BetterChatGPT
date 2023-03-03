import React from 'react';

import ChatContent from './ChatContent';
import ChatInput from './ChatInput';
import MobileBar from '../MobileBar';

const Chat = () => {
  return (
    <div className='flex h-full flex-1 flex-col md:pl-[260px]'>
      <MobileBar />
      <main className='relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1'>
        <ChatContent />
        {/* <ChatInput /> */}
      </main>
    </div>
  );
};

export default Chat;
