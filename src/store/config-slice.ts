import { StoreSlice } from './store';

export interface ConfigSlice {
  openConfig: boolean;
  setOpenConfig: (openConfig: boolean) => void;
}

export const createConfigSlice: StoreSlice<ConfigSlice> = (set, get) => ({
  openConfig: false,
  setOpenConfig: (openConfig: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      openConfig: openConfig,
    }));
  },
});
