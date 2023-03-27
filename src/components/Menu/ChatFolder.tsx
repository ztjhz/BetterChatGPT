import React, { useRef, useState } from 'react';
import useStore from '@store/store';

import DownChevronArrow from '@icon/DownChevronArrow';
import FolderIcon from '@icon/FolderIcon';
import { ChatHistoryInterface, ChatInterface } from '@type/chat';

import ChatHistory from './ChatHistory';
import EditIcon from '@icon/EditIcon';
import DeleteIcon from '@icon/DeleteIcon';
import CrossIcon from '@icon/CrossIcon';
import TickIcon from '@icon/TickIcon';

const ChatFolder = ({
  folderName,
  folderChats,
}: {
  folderName: string;
  folderChats: ChatHistoryInterface[];
}) => {
  const setChats = useStore((state) => state.setChats);

  const inputRef = useRef<HTMLInputElement>(null);

  const [_folderName, _setFolderName] = useState<string>(folderName);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleTick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );

    if (isEdit) {
      updatedChats.forEach((chat) => {
        if (chat.folder === folderName) chat.folder = _folderName;
      });

      setChats(updatedChats);
      setIsEdit(false);
    } else if (isDelete) {
      updatedChats.forEach((chat) => {
        if (chat.folder === folderName) delete chat.folder;
      });

      setChats(updatedChats);
      setIsDelete(false);
    }
  };

  const handleCross = () => {
    setIsDelete(false);
    setIsEdit(false);
  };

  return (
    <div className='w-full'>
      <div className='flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] break-all cursor-pointer'>
        <FolderIcon className='h-4 w-4' />
        <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative'>
          {isEdit ? (
            <input
              type='text'
              className='focus:outline-blue-600 text-sm border-none bg-transparent p-0 m-0 w-full'
              value={_folderName}
              onChange={(e) => {
                _setFolderName(e.target.value);
              }}
              ref={inputRef}
            />
          ) : (
            _folderName
          )}
        </div>
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
              <button
                className='p-1 hover:text-white'
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                <DownChevronArrow
                  className={`${
                    isExpanded ? 'rotate-180' : ''
                  } transition-transform`}
                />
              </button>
            </>
          )}
        </div>
      </div>
      <div className='ml-3 pl-1 border-l-2 border-gray-700 flex flex-col gap-1'>
        {isExpanded &&
          folderChats.map((chat) => (
            <ChatHistory
              title={chat.title}
              chatIndex={chat.index}
              key={`${chat.title}-${chat.index}`}
            />
          ))}
      </div>
    </div>
  );
};

export default ChatFolder;
