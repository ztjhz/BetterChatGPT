import { StoreSlice } from './store';

export interface AuthSlice {
  apiKey?: string;
  apiFree: boolean;
  setApiKey: (apiKey: string) => void;
  setApiFree: (apiFree: boolean) => void;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set, get) => ({
  apiFree: true,
  setApiKey: (apiKey: string) => {
    set((prev: AuthSlice) => ({
      ...prev,
      apiKey: apiKey,
    }));
  },
  setApiFree: (apiFree: boolean) => {
    set((prev: AuthSlice) => ({
      ...prev,
      apiFree: apiFree,
    }));
  },
});
