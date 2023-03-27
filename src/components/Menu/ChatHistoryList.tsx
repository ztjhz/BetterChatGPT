import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';

import NewFolder from './NewFolder';
import ChatFolder from './ChatFolder';
import ChatHistory from './ChatHistory';

import {
  ChatHistoryInterface,
  ChatHistoryFolderInterface,
  ChatInterface,
} from '@type/chat';

const ChatHistoryList = () => {
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const chatTitles = useStore(
    (state) => state.chats?.map((chat) => chat.title),
    shallow
  );

  const [folders, setFolders] = useState<ChatHistoryFolderInterface>({});
  const [noFolders, setNoFolders] = useState<ChatHistoryInterface[]>([]);
  const chatsRef = useRef<ChatInterface[]>(useStore.getState().chats || []);

  const updateFolders = () => {
    const _folders: ChatHistoryFolderInterface = {};
    const _noFolders: ChatHistoryInterface[] = [];
    const chats = useStore.getState().chats;
    if (chats) {
      chats.forEach((chat, index) => {
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

    console.log('folders', _folders);
    console.log('no', _noFolders);
  };

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
    }
  }, [currentChatIndex, chatTitles]);

  return (
    <div className='flex-col flex-1 overflow-y-auto border-b border-white/20'>
      <NewFolder setFolders={setFolders} />
      <div className='flex flex-col gap-2 text-gray-100 text-sm'>
        {Object.keys(folders).map((folderName, index) => (
          <ChatFolder
            folderName={folderName}
            folderChats={folders[folderName]}
            key={`${folderName}-${index}`}
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
