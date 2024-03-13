import React from 'react';
import useStore from '@store/store';

import ChatContent from './ChatContent';
import MobileBar from '../MobileBar';

import StopGeneratingButton from '@components/StopGeneratingButton/StopGeneratingButton';
import TokensToast from '@components/Toast/TokensToast';


const Chat = React.memo(({chatDownloadAreaRef}: {chatDownloadAreaRef: React.RefObject<HTMLDivElement>}) => {
  const hideSideMenu = useStore((state) => state.hideSideMenu);

  return (
    <div
      className={`flex h-full flex-1 flex-col ${
        hideSideMenu ? 'md:pl-0' : 'md:pl-[260px]'
      }`}
    >
      <MobileBar />
      <main className='relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1'>
        <ChatContent chatDownloadAreaRef={chatDownloadAreaRef}/>
      </main>
    </div>
  );
});

export default Chat;
