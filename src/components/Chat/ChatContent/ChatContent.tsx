import React, { useEffect, useRef, RefObject } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import useStore from '@store/store';

import ScrollToBottomButton from './ScrollToBottomButton';
import ChatHeader from './ChatHeader';
import Message from './Message';
import NewMessageButton from './Message/NewMessageButton';
import CrossIcon from '@icon/CrossIcon';

import StopGeneratingButton from '@components/Chat/StopGeneratingButton/StopGeneratingButton';
import TokensToast from '@components/Toast/TokensToast';

interface ChatContentProps {
  chatDownloadAreaRef: RefObject<HTMLDivElement>;
}
  
const ChatContent = ({ chatDownloadAreaRef }: ChatContentProps) =>  {
  const inputRole = useStore((state) => state.inputRole);
  const setError = useStore((state) => state.setError);
  const error = useStore((state) => state.error);


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

  /* For debugging */
  const chatDrafts = useStore( (state) => state.chats?.map((chat) => chat.title + ": " + chat.newMessageDraft));

  // const currChatNewMessageDraft = useStore((state) =>
  // state.chats &&
  // state.chats.length > 0 &&
  // state.currentChatIndex >= 0 &&
  // state.currentChatIndex < state.chats.length
  //   ? (state.chats[state.currentChatIndex].newMessageDraft ?? '')
  //   : ''
  // );

  const newMessageDraftBuffer = useStore((state) => state.newMessageDraftBuffer ?? "");
  const newMessageDraftChatIndex = useStore((state) => state.newMessageDraftChatIndex ?? "");

  const stickyIndex = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages.length
      : 0
  );
  const advancedMode = useStore((state) => state.advancedMode);
  const generatingState = useStore((state) => state.generating);
  const hideSideMenu = useStore((state) => state.hideSideMenu);

  // clear error at the start of generating new messages
  useEffect(() => {
    if (generatingState) {
      setError('');
    }
  }, [generatingState]);

  return (
    <div className='flex-1 overflow-hidden'>
      <ChatHeader />
      <ScrollToBottom
        className='h-full pt-16 dark:bg-gray-800'
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
              content={newMessageDraftBuffer}
              model={undefined}
              messageIndex={stickyIndex}
              sticky
            />)}
         
          {!chatExists && (
            <div className="relative flex mt-10 text-xl text-gray-600 dark:text-gray-300 break-words">You have no active chats. Please use the the New Chat button.</div>
            )}

          {/* ERROR MESSAGE (RED BOX) */}
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
                    {generatingState ?
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
                    {
                    <>
                      {
                      //For debugging only - not needed
                      /* <div className="flex w-full justify-center items-center align-center"> 
                          Chat Drafts: {JSON.stringify(chatDrafts, undefined, 4)}
                      </div> 
                      <div className="flex w-full justify-center items-center align-center"> 
                          New Message Bufer: "{newMessageDraftBuffer}" (for chatId: {newMessageDraftChatIndex})
                      </div> */}
                    </> 
                    }
                  </>
                }
              </div>
    </div>
  );
};

export default ChatContent;
