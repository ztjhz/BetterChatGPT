import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chat-slice';
import { InputSlice, createInputSlice } from './input-slice';
import { AuthSlice, createAuthSlice } from './auth-slice';
import { ConfigSlice, createConfigSlice } from './config-slice';
import { PromptSlice, createPromptSlice } from './prompt-slice';
import {
  LocalStorageInterfaceV0ToV1,
  LocalStorageInterfaceV1ToV2,
  LocalStorageInterfaceV2ToV3,
  LocalStorageInterfaceV3ToV4,
  LocalStorageInterfaceV4ToV5,
  LocalStorageInterfaceV5ToV6,
  LocalStorageInterfaceV6ToV7,
} from '@type/chat';
import {
  migrateV0,
  migrateV1,
  migrateV2,
  migrateV3,
  migrateV4,
  migrateV5,
  migrateV6,
} from './migrate';

export type StoreState = ChatSlice &
  InputSlice &
  AuthSlice &
  ConfigSlice &
  PromptSlice;

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
      ...createPromptSlice(set, get),
    }),
    {
      name: 'free-chat-gpt',
      partialize: (state) => ({
        chats: state.chats,
        currentChatIndex: state.currentChatIndex,
        apiKey: state.apiKey,
        apiEndpoint: state.apiEndpoint,
        theme: state.theme,
        autoTitle: state.autoTitle,
        prompts: state.prompts,
        defaultChatConfig: state.defaultChatConfig,
        defaultSystemMessage: state.defaultSystemMessage,
        hideMenuOptions: state.hideMenuOptions,
        firstVisit: state.firstVisit,
        hideSideMenu: state.hideSideMenu,
      }),
      version: 7,
      migrate: (persistedState, version) => {
        switch (version) {
          case 0:
            migrateV0(persistedState as LocalStorageInterfaceV0ToV1);
          case 1:
            migrateV1(persistedState as LocalStorageInterfaceV1ToV2);
          case 2:
            migrateV2(persistedState as LocalStorageInterfaceV2ToV3);
          case 3:
            migrateV3(persistedState as LocalStorageInterfaceV3ToV4);
          case 4:
            migrateV4(persistedState as LocalStorageInterfaceV4ToV5);
          case 5:
            migrateV5(persistedState as LocalStorageInterfaceV5ToV6);
          case 6:
            migrateV6(persistedState as LocalStorageInterfaceV6ToV7);
            break;
        }
        return persistedState as StoreState;
      },
    }
  )
);

export default useStore;
