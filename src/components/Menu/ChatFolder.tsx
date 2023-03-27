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
  folderIndex,
}: {
  folderName: string;
  folderChats: ChatHistoryInterface[];
  folderIndex: number;
}) => {
  const setChats = useStore((state) => state.setChats);
  const setFoldersName = useStore((state) => state.setFoldersName);
  const setFoldersExpanded = useStore((state) => state.setFoldersExpanded);
  const foldersExpanded = useStore((state) => state.foldersExpanded);

  const inputRef = useRef<HTMLInputElement>(null);

  const [_folderName, _setFolderName] = useState<string>(folderName);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);

  const editTitle = () => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );

    updatedChats.forEach((chat) => {
      if (chat.folder === folderName) chat.folder = _folderName;
    });
    setChats(updatedChats);

    const updatedFolderNames = [...useStore.getState().foldersName];
    const pos = updatedFolderNames.indexOf(folderName);
    if (pos !== -1) updatedFolderNames[pos] = _folderName;
    setFoldersName(updatedFolderNames);

    setIsEdit(false);
  };

  const deleteFolder = () => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    updatedChats.forEach((chat) => {
      if (chat.folder === folderName) delete chat.folder;
    });
    setChats(updatedChats);

    const updatedFoldersName = [...useStore.getState().foldersName];
    const updatedFoldersExpanded = [...useStore.getState().foldersExpanded];

    const i = updatedFoldersName.findIndex((name) => name === folderName);
    updatedFoldersName.splice(i, 1);
    updatedFoldersExpanded.splice(i, 1);

    setFoldersName(updatedFoldersName);
    setFoldersExpanded(updatedFoldersExpanded);
    setIsDelete(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editTitle();
    }
  };

  const handleTick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isEdit) editTitle();
    else if (isDelete) deleteFolder();
  };

  const handleCross = () => {
    setIsDelete(false);
    setIsEdit(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer) {
      e.stopPropagation();
      setIsHover(false);

      const updatedFoldersExpanded = [...foldersExpanded];
      updatedFoldersExpanded[folderIndex] = true;
      setFoldersExpanded(updatedFoldersExpanded);

      const chatIndex = Number(e.dataTransfer.getData('chatIndex'));
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      updatedChats[chatIndex].folder = folderName;
      setChats(updatedChats);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHover(true);
  };

  const handleDragLeave = () => {
    setIsHover(false);
  };

  const toggleExpanded = () => {
    const updatedFoldersExpanded = [...foldersExpanded];
    updatedFoldersExpanded[folderIndex] = !updatedFoldersExpanded[folderIndex];
    setFoldersExpanded(updatedFoldersExpanded);
  };

  return (
    <div
      className={`w-full transition-colors ${isHover ? 'bg-gray-800/40' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        className='flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] break-all cursor-pointer'
        onClick={toggleExpanded}
      >
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
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          ) : (
            _folderName
          )}
        </div>
        <div
          className='absolute flex right-1 z-10 text-gray-300 visible'
          onClick={(e) => e.stopPropagation()}
        >
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
              <button className='p-1 hover:text-white' onClick={toggleExpanded}>
                <DownChevronArrow
                  className={`${
                    foldersExpanded[folderIndex] ? 'rotate-180' : ''
                  } transition-transform`}
                />
              </button>
            </>
          )}
        </div>
      </div>
      <div className='ml-3 pl-1 border-l-2 border-gray-700 flex flex-col gap-1'>
        {foldersExpanded[folderIndex] &&
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
