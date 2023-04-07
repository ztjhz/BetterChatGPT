import { GoogleUploadFileResponse } from '@type/google-api';
import PersistStorage from '@type/persist';

import { createMultipartRelatedBody } from './helper';

export const createDriveFile = async (
  file: File,
  accessToken: string
): Promise<GoogleUploadFileResponse> => {
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
    const result: GoogleUploadFileResponse = await response.json();
    return result;
  } else {
    console.error(
      'Error uploading file:',
      response.status,
      response.statusText
    );
    throw new Error(
      `Error uploading file: ${response.status} ${response.statusText}`
    );
  }
};

export const getDriveFile = async (
  fileId: string,
  accessToken: string
): Promise<PersistStorage> => {
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
  const result: PersistStorage = await response.json();
  return result;
};

export const updateDriveFile = async (
  file: File,
  fileId: string,
  accessToken: string
): Promise<GoogleUploadFileResponse> => {
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
    const result: GoogleUploadFileResponse = await response.json();
    return result;
  } else {
    console.error(
      'Error uploading file:',
      response.status,
      response.statusText
    );
    throw new Error(
      `Error uploading file: ${response.status} ${response.statusText}`
    );
  }
};
