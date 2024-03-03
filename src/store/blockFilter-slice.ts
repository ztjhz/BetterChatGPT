import { StoreSlice } from './store';

export interface BlockFilterSlice {
  blockFilter: 'all' | 'user' | 'assistant' | 'system';
  setBlockFilter: (filter: BlockFilterSlice['blockFilter']) => void;
}

export const createBlockFilterSlice: StoreSlice<BlockFilterSlice> = (set) => ({
  blockFilter: 'all', // Default value
  setBlockFilter: (blockFilter) => set(() => ({ blockFilter })),
});
