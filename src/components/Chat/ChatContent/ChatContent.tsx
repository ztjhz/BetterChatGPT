import React, { useEffect, useRef, RefObject } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import useStore from '@store/store';

import ScrollToBottomButton from './ScrollToBottomButton';
import ChatHeader from './ChatHeader';
import Message from './Message';
import NewMessageButton from './Message/NewMessageButton';
import CrossIcon from '@icon/CrossIcon';

import useSubmit from '@hooks/useSubmit';

import StopGeneratingButton from '@components/Chat/StopGeneratingButton/StopGeneratingButton';
import TokensToast from '@components/Toast/TokensToast';

interface ChatContentProps {
  chatDownloadAreaRef: RefObject<HTMLDivElement>;
}
  
const ChatContent = ({ chatDownloadAreaRef }: ChatContentProps) =>  {
  const inputRole = useStore((state) => state.inputRole);
  const setError = useStore((state) => state.setError);

  const chatExists =  useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
  );
  const messages = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages
      : []
  );
  const stickyIndex = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages.length
      : 0
  );
  const advancedMode = useStore((state) => state.advancedMode);
  const generating = useStore.getState().generating;
  const hideSideMenu = useStore((state) => state.hideSideMenu);

  // clear error at the start of generating new messages
  useEffect(() => {
    if (generating) {
      setError('');
    }
  }, [generating]);

  const { error } = useSubmit();

  return (
    <div className='flex-1 overflow-hidden'>
      <ChatHeader />
      <ScrollToBottom
        className='h-full dark:bg-gray-800'
        followButtonClassName='hidden'
      >
        <ScrollToBottomButton />
        <div className='flex flex-col items-center text-sm dark:bg-gray-800'>
          <div
            className='flex flex-col items-center text-sm dark:bg-gray-800 w-full'
            ref={chatDownloadAreaRef}
          >
            {/* {<ChatHeader />} */}
            
            {/* "Plus" New Message Button to insert messages in the middle of the thread 
              {!generating && advancedMode && messages?.length === 0 && (
              <NewMessageButton messageIndex={-1} />
            )} */}
            {messages?.map((message, index) => (
              (advancedMode || index !== 0 || message.role !== 'system') && (
                <React.Fragment key={index}>
                  <Message
                    role={message.role}
                    model={message.model} //Only applicable to Assistant: Which model generated the message;
                    content={message.content}
                    messageIndex={index}
                  />
                  {/* "Plus" New Message Button to insert messages in the middle of the thread 
                    {!generating && advancedMode && <NewMessageButton messageIndex={index} />} */}
                </React.Fragment>
              )
            ))}
          </div>

          {chatExists && (
            <Message
              role={inputRole}
              content=''
              model={undefined}
              messageIndex={stickyIndex}
              sticky
            />)}
         
          {!chatExists && (
            <div className="relative flex mt-10 text-xl text-gray-600 dark:text-gray-300 break-words">You have no active chats. Please use the the New Chat button.</div>
            )}

          {error !== '' && (
            <div className='relative py-2 px-3 w-3/5 mt-3 max-md:w-11/12 border rounded-md border-red-500 bg-red-500/10'>
              <div className='text-gray-600 dark:text-gray-100 text-sm whitespace-pre-wrap'>
                {error}
              </div>
              <div
                className='text-white absolute top-1 right-1 cursor-pointer'
                onClick={() => {
                  setError('');
                }}
              >
                <CrossIcon />
              </div>
            </div>
          )}
          <div
            className={`mt-4 w-full m-auto  ${
              hideSideMenu
                ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl'
                : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'
            }`}
          >

        {/* right-0  md:w-full*/}
          </div>
          <div className='w-full h-36'></div>
        </div>
      </ScrollToBottom>

      <div className='absolute bottom-6 left-8 m-auto flex min-w-[12em] gap-0 md:gap-2 justify-left'>
                {
                  <>
                    {useStore.getState().generating ?
                      (
                        <StopGeneratingButton />
                      )
                      :
                      (
                        <>
                          <TokensToast />
                        </>
                      )
                    }
                  </>
                }
              </div>
    </div>
  );
};

export default ChatContent;
