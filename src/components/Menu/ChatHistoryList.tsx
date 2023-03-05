import React, { MouseEventHandler, useEffect, useState } from 'react';
import useStore from '@store/store';

import ChatIcon from '@icon/ChatIcon';
import EditIcon from '@icon/EditIcon';
import DeleteIcon from '@icon/DeleteIcon';
import TickIcon from '@icon/TickIcon';
import CrossIcon from '@icon/CrossIcon';

import useInitialiseNewChat from '@hooks/useInitialiseNewChat';

const ChatHistoryList = () => {
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const chats = useStore((state) => state.chats);

  return (
    <div className='flex-col flex-1 overflow-y-auto border-b border-white/20'>
      <div className='flex flex-col gap-2 text-gray-100 text-sm'>
        {chats &&
          chats.map((chat, index) => (
            <ChatHistory
              title={chat.title}
              key={`${chat.title}-${index}`}
              chatIndex={index}
              onClick={() => {
                setCurrentChatIndex(index);
              }}
            />
          ))}
        {/* <ShowMoreButton /> */}
      </div>
    </div>
  );
};

const ShowMoreButton = () => {
  return (
    <button className='btn relative btn-dark btn-small m-auto mb-2'>
      <div className='flex items-center justify-center gap-2'>Show more</div>
    </button>
  );
};

const ChatHistoryClass = {
  normal:
    'flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group',
  active:
    'flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 bg-gray-800 hover:bg-gray-800 group',
  normalGradient:
    'absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]',
  activeGradient:
    'absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-800',
};

const ChatHistory = ({
  title,
  chatIndex,
  onClick,
}: {
  title: string;
  chatIndex: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
}) => {
  const initialiseNewChat = useInitialiseNewChat();
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [_title, _setTitle] = useState<string>(title);

  const active = currentChatIndex === chatIndex;

  const handleTick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const updatedChats = JSON.parse(JSON.stringify(useStore.getState().chats));
    if (isEdit) {
      updatedChats[chatIndex].title = _title;
      setChats(updatedChats);
      setIsEdit(false);
    } else if (isDelete) {
      updatedChats.splice(chatIndex, 1);
      if (updatedChats.length > 0) {
        setCurrentChatIndex(0);
        setChats(updatedChats);
      } else {
        initialiseNewChat();
      }
      setIsDelete(false);
    }
  };

  const handleCross = () => {
    setIsDelete(false);
    setIsEdit(false);
  };

  return (
    <a
      className={active ? ChatHistoryClass.active : ChatHistoryClass.normal}
      onClick={(e) => onClick && onClick(e)}
    >
      <ChatIcon />
      <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative'>
        {isEdit ? (
          <input
            type='text'
            className='text-sm border-none bg-transparent p-0 m-0 w-full mr-0'
            value={_title}
            onChange={(e) => {
              _setTitle(e.target.value);
            }}
          />
        ) : (
          _title
        )}

        <div
          className={
            active
              ? ChatHistoryClass.activeGradient
              : ChatHistoryClass.normalGradient
          }
        ></div>
      </div>
      {active && (
        <div className='absolute flex right-1 z-10 text-gray-300 visible'>
          {isDelete || isEdit ? (
            <>
              <button className='p-1 hover:text-white' onClick={handleTick}>
                <TickIcon />
              </button>
              <button className='p-1 hover:text-white' onClick={handleCross}>
                <CrossIcon />
              </button>
            </>
          ) : (
            <>
              <button
                className='p-1 hover:text-white'
                onClick={() => setIsEdit(true)}
              >
                <EditIcon />
              </button>
              <button
                className='p-1 hover:text-white'
                onClick={() => setIsDelete(true)}
              >
                <DeleteIcon />
              </button>
            </>
          )}
        </div>
      )}
    </a>
  );
};

export default ChatHistoryList;
