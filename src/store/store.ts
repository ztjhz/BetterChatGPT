import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chat-slice';
import { InputSlice, createInputSlice } from './input-slice';
import { AuthSlice, createAuthSlice } from './auth-slice';
import { ConfigSlice, createConfigSlice } from './config-slice';
import { LocalStorageInterface } from '@type/chat';
import { migrateV0 } from './migrate';

export type StoreState = ChatSlice & InputSlice & AuthSlice & ConfigSlice;

export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState']
) => T;

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createChatSlice(set, get),
      ...createInputSlice(set, get),
      ...createAuthSlice(set, get),
      ...createConfigSlice(set, get),
    }),
    {
      name: 'free-chat-gpt',
      partialize: (state) => ({
        chats: state.chats,
        currentChatIndex: state.currentChatIndex,
        apiKey: state.apiKey,
        apiFree: state.apiFree,
        apiFreeEndpoint: state.apiFreeEndpoint,
        theme: state.theme,
      }),
      version: 1,
      migrate: (persistedState, version) => {
        switch (version) {
          case 0:
            migrateV0(persistedState as LocalStorageInterface);
            break;
        }
        return persistedState as StoreState;
      },
    }
  )
);

export default useStore;
