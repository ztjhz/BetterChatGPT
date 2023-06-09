import { StoreSlice } from './store';
import {request} from '@api/request'

export interface AuthSlice {
  wallet_address: string;
  setWalletAddress: (wallet_addres: string) => void;
  unsetWalletAddress: () => void;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set, get) => ({
  wallet_address: '',
  setWalletAddress: (wallet_addres: string) => {
    set((prev: AuthSlice) => ({
      ...prev,
      wallet_address: wallet_addres
    }));
  },
  unsetWalletAddress: () => {
    set((prev: AuthSlice) => ({
      ...prev,
      wallet_address: ''
    }));
  }
});