import { StoreSlice } from './store';

export interface AuthSlice {
  apiKey?: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  setApiKey: (apiKey: string) => void;
  setApiFree: (apiFree: boolean) => void;
  setApiFreeEndpoint: (apiFreeEndpoint: string) => void;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set, get) => ({
  apiFree: true,
  apiFreeEndpoint: 'https://chatgpt-api.shn.hk/v1/',
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
  setApiFreeEndpoint: (apiFreeEndpoint: string) => {
    set((prev: AuthSlice) => ({
      ...prev,
      apiFreeEndpoint: apiFreeEndpoint,
    }));
  },
});
