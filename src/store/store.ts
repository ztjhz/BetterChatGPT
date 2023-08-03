import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chat-slice';
import { InputSlice, createInputSlice } from './input-slice';
import { ConfigSlice, createConfigSlice } from './config-slice';
import { ToastSlice, createToastSlice } from './toast-slice';
import { SearchSlice, createSearchSlice } from './search-slice';
import { AuthSlice, createAuthSlice } from './auth-slice';
import { ActivitySlice, createActivitySlice } from './activity-slice';

export type StoreState = ChatSlice &
  InputSlice &
  ConfigSlice &
  SearchSlice &
  AuthSlice &
  ToastSlice & ActivitySlice;

export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState']
) => T;

export const createPartializedState = (state: StoreState) => ({
  chats: state.chats,
  currentChatIndex: state.currentChatIndex,
  theme: state.theme,
  autoTitle: state.autoTitle,
  advancedMode: state.advancedMode,
  defaultChatConfig: state.defaultChatConfig,
  defaultSystemMessage: state.defaultSystemMessage,
  hideMenuOptions: state.hideMenuOptions,
  hideSideMenu: state.hideSideMenu,
  folders: state.folders,
  enterToSubmit: state.enterToSubmit,
  inlineLatex: state.inlineLatex,
  markdownMode: state.markdownMode,
  totalTokenUsed: state.totalTokenUsed,
  countTotalTokens: state.countTotalTokens,
  sources: state.sources,
  wallet_address: state.wallet_address,
  credit: state.credit,
});

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createChatSlice(set, get),
      ...createInputSlice(set, get),
      ...createConfigSlice(set, get),
      ...createToastSlice(set, get),
      ...createSearchSlice(set, get),
      ...createAuthSlice(set, get),
      ...createActivitySlice(set, get),
    }),
    {
      name: 'Q&A3',
      partialize: (state) => createPartializedState(state),
      version: 11
    }
  )
);

export default useStore;
