import { SyncStatus } from '@type/google-api';
import { StoreSlice } from './cloud-auth-store';

export interface CloudAuthSlice {
  googleAccessToken?: string;
  googleRefreshToken?: string;
  cloudSync: boolean;
  syncStatus: SyncStatus;
  fileId?: string;
  setGoogleAccessToken: (googleAccessToken?: string) => void;
  setGoogleRefreshToken: (googleRefreshToken?: string) => void;
  setFileId: (fileId?: string) => void;
  setCloudSync: (cloudSync: boolean) => void;
  setSyncStatus: (syncStatus: SyncStatus) => void;
}

export const createCloudAuthSlice: StoreSlice<CloudAuthSlice> = (set, get) => ({
  cloudSync: false,
  syncStatus: 'unauthenticated',
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
  setCloudSync: (cloudSync: boolean) => {
    set((prev: CloudAuthSlice) => ({
      ...prev,
      cloudSync: cloudSync,
    }));
  },
  setSyncStatus: (syncStatus: SyncStatus) => {
    set((prev: CloudAuthSlice) => ({
      ...prev,
      syncStatus: syncStatus,
    }));
  },
});
