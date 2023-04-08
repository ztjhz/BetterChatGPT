import { StoreSlice } from './cloud-auth-store';

export interface CloudAuthSlice {
  googleAccessToken?: string;
  googleRefreshToken?: string;
  fileId?: string;
  setGoogleAccessToken: (googleAccessToken?: string) => void;
  setGoogleRefreshToken: (googleRefreshToken?: string) => void;
  setFileId: (fileId?: string) => void;
}

export const createCloudAuthSlice: StoreSlice<CloudAuthSlice> = (set, get) => ({
  setGoogleAccessToken: (googleAccessToken?: string) => {
    set((prev: CloudAuthSlice) => ({
      ...prev,
      googleAccessToken: googleAccessToken,
    }));
  },
  setGoogleRefreshToken: (googleRefreshToken?: string) => {
    set((prev: CloudAuthSlice) => ({
      ...prev,
      googleRefreshToken: googleRefreshToken,
    }));
  },
  setFileId: (fileId?: string) => {
    set((prev: CloudAuthSlice) => ({
      ...prev,
      fileId: fileId,
    }));
  },
});
