import { StoreSlice } from './store';
import {request} from '@api/request'

export interface AuthSlice {
  wallet_address: string;
  credit: number;
  fetchCredit: () => Promise<void>;
  setWalletAddress: (wallet_addres: string) => void;
  unsetWalletAddress: () => void;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set, get) => ({
  wallet_address: '',
  credit:0,
  fetchCredit: async () => {
    const {data} = await request.get('/user/credit')
    set((prev: AuthSlice) => ({
      ...prev,
      credit: data?.data
    }));
  },
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
  },
});