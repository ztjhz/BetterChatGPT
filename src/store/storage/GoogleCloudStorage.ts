import { PersistStorage, StorageValue, StateStorage } from 'zustand/middleware';
import useCloudAuthStore from '@store/cloud-auth-store';
import {
  createDriveFile,
  deleteDriveFile,
  getDriveFile,
  updateDriveFile,
  validateGoogleOath2AccessToken,
} from '@api/google-api';
import PersistStorageState from '@type/persist';

const createGoogleCloudStorage = ():
  | PersistStorage<PersistStorageState>
  | undefined => {
  const accessToken = useCloudAuthStore.getState().googleAccessToken;
  const fileId = useCloudAuthStore.getState().fileId;
  if (!accessToken || !fileId) return;

  try {
    const authenticated = validateGoogleOath2AccessToken(accessToken);
    if (!authenticated) return;
  } catch (e) {
    // prevent error if the storage is not defined (e.g. when server side rendering a page)
    return;
  }
  const persistStorage: PersistStorage<PersistStorageState> = {
    getItem: async (name) => {
      const data: StorageValue<PersistStorageState> = await getDriveFile(
        fileId,
        accessToken
      );

      return data;
    },
    setItem: async (name, newValue): Promise<void> => {
      const blob = new Blob([JSON.stringify(newValue)], {
        type: 'application/json',
      });
      const file = new File([blob], 'better-chatgpt.json', {
        type: 'application/json',
      });

      await updateDriveFile(file, fileId, accessToken);
    },

    removeItem: async (name): Promise<void> => {
      await deleteDriveFile(accessToken, fileId);
    },
  };
  return persistStorage;
};

export default createGoogleCloudStorage;
