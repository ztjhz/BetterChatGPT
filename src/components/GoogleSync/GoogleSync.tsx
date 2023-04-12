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

import GoogleSyncButton from './GoogleSyncButton';
import PopupModal from '@components/PopupModal';

import GoogleIcon from '@icon/GoogleIcon';
import TickIcon from '@icon/TickIcon';
import RefreshIcon from '@icon/RefreshIcon';
import { SyncStatus } from '@type/google-api';

const GoogleSync = ({ clientId }: { clientId: string }) => {
  const { t } = useTranslation(['drive']);

  const setFileId = useGStore((state) => state.setFileId);
  const googleAccessToken = useGStore((state) => state.googleAccessToken);
  const syncStatus = useGStore((state) => state.syncStatus);
  const cloudSync = useGStore((state) => state.cloudSync);
  const setSyncStatus = useGStore((state) => state.setSyncStatus);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(cloudSync);

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
    } else {
      setSyncStatus('unauthenticated');
    }
  };

  useEffect(() => {
    if (googleAccessToken) {
      setSyncStatus('syncing');
      initialiseState(googleAccessToken);
    }
  }, [googleAccessToken]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div
        className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <GoogleIcon /> {t('name')}
        {cloudSync && <SyncIcon status={syncStatus} />}
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
  const { t } = useTranslation(['drive']);

  return (
    <PopupModal
      title={t('name') as string}
      setIsModalOpen={setIsModalOpen}
      cancelButton={false}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-300 text-sm flex flex-col items-center gap-4 text-center'>
        <p>{t('tagline')}</p>
        <GoogleSyncButton
          loginHandler={() => {
            setIsModalOpen(false);
            window.setTimeout(() => {
              setIsModalOpen(true);
            }, 3540000); // timeout - 3540000ms = 59 min (access token last 60 min)
          }}
        />
        <p className='border border-gray-400 px-3 py-2 rounded-md'>
          {t('notice')}
        </p>
        <p>{t('privacy')}</p>
      </div>
    </PopupModal>
  );
};

const SyncIcon = ({ status }: { status: SyncStatus }) => {
  const statusToIcon = {
    unauthenticated: (
      <div className='bg-red-600/80 rounded-full w-4 h-4 text-xs flex justify-center items-center'>
        !
      </div>
    ),
    syncing: (
      <div className='bg-orange-600/80 rounded-full p-1'>
        <RefreshIcon className='h-2 w-2' />
      </div>
    ),
    synced: (
      <div className='bg-green-600/80 rounded-full p-1'>
        <TickIcon className='h-2 w-2' />
      </div>
    ),
  };
  return statusToIcon[status] || null;
};

export default GoogleSync;
