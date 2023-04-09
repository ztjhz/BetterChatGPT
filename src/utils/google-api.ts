import { listDriveFiles } from '@api/google-api';

import useStore, { createPartializedState } from '@store/store';

export const getFileID = async (
  googleAccessToken: string
): Promise<string | null> => {
  const driveFiles = await listDriveFiles(googleAccessToken);
  if (driveFiles.files.length === 0) return null;
  return driveFiles.files[0].id;
};

export const stateToFile = () => {
  const partializedState = createPartializedState(useStore.getState());

  const blob = new Blob([JSON.stringify(partializedState)], {
    type: 'application/json',
  });
  const file = new File([blob], 'better-chatgpt.json', {
    type: 'application/json',
  });

  return file;
};
