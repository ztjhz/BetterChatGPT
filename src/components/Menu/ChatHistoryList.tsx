import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';

import NewFolder from './NewFolder';
import ChatFolder from './ChatFolder';
import ChatHistory from './ChatHistory';
import ChatSearch from './ChatSearch';

import {
  ChatHistoryInterface,
  ChatHistoryFolderInterface,
  ChatInterface,
} from '@type/chat';

const ChatHistoryList = () => {
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setChats = useStore((state) => state.setChats);
  const chatTitles = useStore(
    (state) => state.chats?.map((chat) => chat.title),
    shallow
  );

  const [isHover, setIsHover] = useState<boolean>(false);
  const [folders, setFolders] = useState<ChatHistoryFolderInterface>({});
  const [noFolders, setNoFolders] = useState<ChatHistoryInterface[]>([]);
  const [filter, setFilter] = useState<string>('');

  const chatsRef = useRef<ChatInterface[]>(useStore.getState().chats || []);
  const foldersNameRef = useRef<string[]>(useStore.getState().foldersName);
  const filterRef = useRef<string>(filter);

  const updateFolders = useRef(() => {
    const _folders: ChatHistoryFolderInterface = {};
    const _noFolders: ChatHistoryInterface[] = [];
    const chats = useStore.getState().chats;
    const foldersName = useStore.getState().foldersName;

    foldersName.forEach((f) => (_folders[f] = []));

    if (chats) {
      chats.forEach((chat, index) => {
        const filterLowerCase = filterRef.current.toLowerCase();
        if (
          !chat.title.toLocaleLowerCase().includes(filterLowerCase) &&
          !chat.folder?.toLowerCase().includes(filterLowerCase) &&
          index !== currentChatIndex
        )
          return;

        if (!chat.folder) {
          _noFolders.push({ title: chat.title, index: index });
        } else {
          if (!_folders[chat.folder]) _folders[chat.folder] = [];
          _folders[chat.folder].push({ title: chat.title, index: index });
        }
      });
    }

    setFolders(_folders);
    setNoFolders(_noFolders);
  }).current;

  useEffect(() => {
    updateFolders();

    useStore.subscribe((state) => {
      if (
        !state.generating &&
        state.chats &&
        state.chats !== chatsRef.current
      ) {
        updateFolders();
        chatsRef.current = state.chats;
      } else if (state.foldersName !== foldersNameRef.current) {
        updateFolders();
        foldersNameRef.current = state.foldersName;
      }
    });
  }, []);

  useEffect(() => {
    if (
      chatTitles &&
      currentChatIndex >= 0 &&
      currentChatIndex < chatTitles.length
    ) {
      document.title = chatTitles[currentChatIndex];

      const chats = useStore.getState().chats;
      if (chats) {
        const folderIndex = useStore
          .getState()
          .foldersName.findIndex((f) => f === chats[currentChatIndex].folder);

        if (folderIndex) {
          const updatedFolderExpanded = [
            ...useStore.getState().foldersExpanded,
          ];
          updatedFolderExpanded[folderIndex] = true;
          useStore.getState().setFoldersExpanded(updatedFolderExpanded);
        }
      }
    }
  }, [currentChatIndex, chatTitles]);

  useEffect(() => {
    filterRef.current = filter;
    updateFolders();
  }, [filter]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer) {
      e.stopPropagation();
      setIsHover(false);

      const chatIndex = Number(e.dataTransfer.getData('chatIndex'));
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      delete updatedChats[chatIndex].folder;
      setChats(updatedChats);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHover(true);
  };

  const handleDragLeave = () => {
    setIsHover(false);
  };

  const handleDragEnd = () => {
    setIsHover(false);
  };

  return (
    <div
      className={`flex-col flex-1 overflow-y-auto border-b border-white/20 ${
        isHover ? 'bg-gray-800/40' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
    >
      <NewFolder />
      <ChatSearch filter={filter} setFilter={setFilter} />
      <div className='flex flex-col gap-2 text-gray-100 text-sm'>
        {Object.keys(folders).map((folderName, folderIndex) => (
          <ChatFolder
            folderName={folderName}
            folderChats={folders[folderName]}
            folderIndex={folderIndex}
            key={folderName}
          />
        ))}
        {noFolders.map(({ title, index }) => (
          <ChatHistory
            title={title}
            key={`${title}-${index}`}
            chatIndex={index}
          />
        ))}
      </div>
      <div className='w-full h-10' />
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

export default ChatHistoryList;
