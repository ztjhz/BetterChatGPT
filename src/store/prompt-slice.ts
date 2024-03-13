import { StoreSlice } from './store';
import { Prompt } from '@type/prompt';
import defaultPrompts from '@constants/prompt';

export interface PromptSlice {
  prompts: Prompt[];
  setPrompts: (commandPrompt: Prompt[]) => void;
}

export const createPromptSlice: StoreSlice<PromptSlice> = (set, get) => ({
  prompts: defaultPrompts,
  setPrompts: (prompts: Prompt[]) => {
    set((prev: PromptSlice) => ({
      ...prev,
      prompts: prompts,
    }));
  },
});
