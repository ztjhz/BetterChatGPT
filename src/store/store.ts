import create, { SetState, GetState } from 'zustand';
import { ChatSlice, createChatSlice } from './chat-slice';
import { InputSlice, createInputSlice } from './input-slice';
import { AuthSlice, createAuthSlice } from './auth-slice';
import { ConfigSlice, createConfigSlice } from './config-slice';

export type StoreState = ChatSlice & InputSlice & AuthSlice & ConfigSlice;

export type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => T;

const useStore = create<StoreState>((set, get) => ({
  ...createChatSlice(set, get),
  ...createInputSlice(set, get),
  ...createAuthSlice(set, get),
  ...createConfigSlice(set, get),
}));

export default useStore;
