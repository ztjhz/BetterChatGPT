import { StoreSlice } from './store';
import { Theme } from '@type/theme';

export interface ConfigSlice {
  openConfig: boolean;
  theme: Theme;
  setOpenConfig: (openConfig: boolean) => void;
  setTheme: (theme: Theme) => void;
}

export const createConfigSlice: StoreSlice<ConfigSlice> = (set, get) => ({
  openConfig: false,
  theme: 'dark',
  setOpenConfig: (openConfig: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      openConfig: openConfig,
    }));
  },
  setTheme: (theme: Theme) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      theme: theme,
    }));
  },
});
