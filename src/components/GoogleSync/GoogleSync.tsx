import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

import useStore from '@store/store';
import useGStore from '@store/cloud-auth-store';

import {
  createDriveFile,
  validateGoogleOath2AccessToken,
} from '@api/google-api';
import { getFileID, stateToFile } from '@utils/google-api';
import createGoogleCloudStorage from '@store/storage/GoogleCloudStorage';

import LoginLogoutButton from './LoginLogoutButton';
import PopupModal from '@components/PopupModal';
import { t } from 'i18next';

const GoogleSync = ({ clientId }: { clientId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const setFileId = useGStore((state) => state.setFileId);
  const googleAccessToken = useGStore((state) => state.googleAccessToken);

  const initialiseState = async (_googleAccessToken: string) => {
    const validated = await validateGoogleOath2AccessToken(_googleAccessToken);
    if (validated) {
      try {
        const fileID = await getFileID(_googleAccessToken);

        if (fileID) {
          setFileId(fileID);
          useStore.persist.setOptions({ storage: createGoogleCloudStorage() });
          useStore.persist.rehydrate();
        } else {
          const googleFile = await createDriveFile(
            stateToFile(),
            _googleAccessToken
          );
          setFileId(googleFile.id);
          useStore.persist.setOptions({
            storage: createGoogleCloudStorage(),
          });
          await useStore.persist.rehydrate();
        }
      } catch (e: unknown) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (googleAccessToken) {
      initialiseState(googleAccessToken);
    }
  }, [googleAccessToken]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div
        className='btn btn-neutral cursor-pointer'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Google Sync
      </div>
      {isModalOpen && <GooglePopup setIsModalOpen={setIsModalOpen} />}
    </GoogleOAuthProvider>
  );
};

const GooglePopup = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();

  return (
    <PopupModal
      title={t('googleCloudSync') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={() => {}}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
        <LoginLogoutButton />
      </div>
    </PopupModal>
  );
};

export default GoogleSync;
