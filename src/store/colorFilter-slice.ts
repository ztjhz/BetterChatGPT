import { StoreSlice } from './store';

export interface ColorFilterSlice {
  colorFilter: string;
  setColorFilter: (color: string) => void;
}

export const createColorFilterSlice: StoreSlice<ColorFilterSlice> = (set) => ({
  colorFilter: '', // Initial state
  setColorFilter: (color) => {
    console.log("setColorFilter:", color);
    set({ colorFilter: color });
  },
});

