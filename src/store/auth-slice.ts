import { StoreSlice } from './store';
import {request} from '@api/request'

interface checkinStatus {
  today_count?: number
  check_in_day?: number
}

export interface AuthSlice {
  wallet_address: string;
  credit: number;
  external_credit: number;
  checkinStatus: checkinStatus;
  fetchCredit: () => Promise<void>;
  fetchExternalCredit: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setWalletAddress: (wallet_addres: string) => void;
  unsetWalletAddress: () => void;
  getCheckinStatus: () => void;
  user: any;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set, get) => ({
  wallet_address: '',
  credit:0,
  external_credit: 0,
  user: {},
  checkinStatus: {},
  fetchUser: async () => {
    const {data} = await request.get('/user/me')
    set((prev: AuthSlice) => ({
      ...prev,
      user: data?.data
    }))
  },
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
  getCheckinStatus: async () => {
    const {data} = await request.get('/user/check-in/status')
    set((prev: AuthSlice) => ({
      ...prev,
      checkinStatus: data?.data
    }));
  },
  fetchExternalCredit: async () => {
    const {data} = await request.get('/user/external_credit')
  }
});