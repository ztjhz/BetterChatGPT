import { StoreSlice } from './store';
import { Role } from '@type/chat';

export interface InputSlice {
  inputRole: Role;
  setInputRole: (inputRole: Role) => void;
}

export const createInputSlice: StoreSlice<InputSlice> = (set, get) => ({
  inputRole: 'user',
  setInputRole: (inputRole: Role) => {
    set((prev: InputSlice) => ({
      ...prev,
      inputRole: inputRole,
    }));
  },
});
