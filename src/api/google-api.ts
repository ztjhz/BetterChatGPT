import { debounce } from 'lodash';
import { StorageValue } from 'zustand/middleware';
import useStore from '@store/store';
import useCloudAuthStore from '@store/cloud-auth-store';
import {
  GoogleTokenInfo,
  GoogleFileResource,
  GoogleFileList,
} from '@type/google-api';
import PersistStorageState from '@type/persist';

import { createMultipartRelatedBody } from './helper';

export const createDriveFile = async (
  file: File,
  accessToken: string
): Promise<GoogleFileResource> => {
  const boundary = 'better_chatgpt';
  const metadata = {
    name: file.name,
    mimeType: file.type,
  };
  const requestBody = createMultipartRelatedBody(metadata, file, boundary);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': requestBody.size.toString(),
      },
      body: requestBody,
    }
  );

  if (response.ok) {
    const result: GoogleFileResource = await response.json();
    return result;
  } else {
    throw new Error(
      `Error uploading file: ${response.status} ${response.statusText}`
    );
  }
};

export const getDriveFile = async <S>(
  fileId: string,
  accessToken: string
): Promise<StorageValue<S>> => {
  const response = await fetch(
    `https://content.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const result: StorageValue<S> = await response.json();
  return result;
};

export const getDriveFileTyped = async (
  fileId: string,
  accessToken: string
): Promise<StorageValue<PersistStorageState>> => {
  return await getDriveFile(fileId, accessToken);
};

export const listDriveFiles = async (
  accessToken: string
): Promise<GoogleFileList> => {
  const response = await fetch(
    'https://www.googleapis.com/drive/v3/files?orderBy=createdTime desc',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error listing google drive files: ${response.status} ${response.statusText}`
    );
  }

  const result: GoogleFileList = await response.json();
  return result;
};

export const updateDriveFile = async (
  file: File,
  fileId: string,
  accessToken: string
): Promise<GoogleFileResource> => {
  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: file,
    }
  );
  if (response.ok) {
    const result: GoogleFileResource = await response.json();
    return result;
  } else {
    throw new Error(
      `Error uploading file: ${response.status} ${response.statusText}`
    );
  }
};

export const updateDriveFileName = async (
  fileName: string,
  fileId: string,
  accessToken: string
) => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: fileName }),
    }
  );
  if (response.ok) {
    const result: GoogleFileResource = await response.json();
    return result;
  } else {
    throw new Error(
      `Error updating file name: ${response.status} ${response.statusText}`
    );
  }
};

export const deleteDriveFile = async (fileId: string, accessToken: string) => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.ok) {
    return true;
  } else {
    throw new Error(
      `Error deleting file name: ${response.status} ${response.statusText}`
    );
  }
};

export const validateGoogleOath2AccessToken = async (accessToken: string) => {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
  );
  if (!response.ok) return false;
  const result: GoogleTokenInfo = await response.json();
  return result;
};

export const updateDriveFileDebounced = debounce(
  async (file: File, fileId: string, accessToken: string) => {
    try {
      const result = await updateDriveFile(file, fileId, accessToken);
      useCloudAuthStore.getState().setSyncStatus('synced');
      return result;
    } catch (e: unknown) {
      useStore.getState().setToastMessage((e as Error).message);
      useStore.getState().setToastShow(true);
      useStore.getState().setToastStatus('error');
      useCloudAuthStore.getState().setSyncStatus('unauthenticated');
    }
  },
  5000
);
