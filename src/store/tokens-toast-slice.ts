import { StoreSlice } from './store';

export interface TokensToastSlice {
  tokensToastShow: boolean;
  tokensToastInputTokens: string;
  tokensToastCompletionTokens: string;
  setTokensToastShow: (tokensToastShow: boolean) => void;
  setTokensToastInputTokens: (tokensToastInputTokens: string) => void;
  setTokensToastCompletionTokens: (tokensToastCompletionTokens: string) => void;
}

export const createTokensToastSlice: StoreSlice<TokensToastSlice> = (set, get) => ({
  tokensToastShow: false,
  tokensToastInputTokens: "0",
  tokensToastCompletionTokens: "0",
  setTokensToastShow: (tokensToastShow: boolean) => {
    set((prev) => ({ ...prev, tokensToastShow }));
  },
  setTokensToastInputTokens: (tokensToastInputTokens: string) => {
    set((prev: TokensToastSlice) => ({ ...prev, tokensToastInputTokens }));
  },
  setTokensToastCompletionTokens: (tokensToastCompletionTokens: string) => {
    set((prev: TokensToastSlice) => ({ ...prev, tokensToastCompletionTokens }));
  },
});
