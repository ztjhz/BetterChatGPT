import { handleNewMessageDraftBufferPersist, handleNewMessageDraftBufferRetrieve } from '@utils/handleNewMessageDraftsPersistence';
import useStore, { StoreSlice } from './store';
import { ChatInterface, FolderCollection, MessageInterface } from '@type/chat';

export interface ChatSlice {
  chats?: ChatInterface[];
  currentChatIndex: number;
  generating: boolean;
  error: string;

  /* See comments in utils/handleNewMessageDraftsPersistence.ts */
  newMessageDraftBuffer?: string;
  newMessageDraftChatIndex?: number;

  folders: FolderCollection;
  setChats: (chats: ChatInterface[]) => void;
  setCurrentChatIndex: (currentChatIndex: number) => void;
  setGenerating: (generating: boolean) => void;
  setError: (error: string) => void;
  setNewMessageDraftBuffer: (content: string, chatIndex: number) => void;
  setFolders: (folders: FolderCollection) => void;
}

export const createChatSlice: StoreSlice<ChatSlice> = (set, get) => ({
  currentChatIndex: -1,
  generating: false,
  error: '',
  newMessageDraftBuffer: '',
  newMessageDraftChatIndex: -1,
  folders: {},

  setChats: (chats: ChatInterface[]) => {
    set((prev: ChatSlice) => ({
      ...prev,
      chats: chats,
    }));
  },

  setCurrentChatIndex: (currentChatIndex: number) => {

    console.debug(`setCurrentChatIndex: ${currentChatIndex}`)

    // Synchronize New Message Draft Buffer with chat-level state
    handleNewMessageDraftBufferPersist("setCurrentChatIndex");

    set((prev: ChatSlice) => ({
      ...prev,
      currentChatIndex: currentChatIndex,

      // Clear the error state whenever the current chat index is updated
      error: "", 
    }));

     // Synchronize New Message Draft Buffer with chat-level state
    handleNewMessageDraftBufferRetrieve();
    
  },

  setGenerating: (generating: boolean) => {
    set((prev: ChatSlice) => ({
      ...prev,
      generating: generating,
    }));
  },
  setError: (error: string) => {
    set((prev: ChatSlice) => ({
      ...prev,
      error: error,
    }));
  },
  setNewMessageDraftBuffer: (content: string, chatIndex: number) => {
    set((prev: ChatSlice) => ({
      ...prev,
      newMessageDraftBuffer: content,
      newMessageDraftChatIndex: chatIndex,
    })); 
  },
  setFolders: (folders: FolderCollection) => {
    set((prev: ChatSlice) => ({
      ...prev,
      folders: folders,
    }));
  },
});
