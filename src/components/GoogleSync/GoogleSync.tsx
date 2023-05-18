import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

import useStore from '@store/store';
import useGStore from '@store/cloud-auth-store';

import {
  createDriveFile,
  deleteDriveFile,
  updateDriveFileName,
  validateGoogleOath2AccessToken,
} from '@api/google-api';
import { getFiles, stateToFile } from '@utils/google-api';
import createGoogleCloudStorage from '@store/storage/GoogleCloudStorage';

import GoogleSyncButton from './GoogleSyncButton';
import PopupModal from '@components/PopupModal';

import GoogleIcon from '@icon/GoogleIcon';
import TickIcon from '@icon/TickIcon';
import RefreshIcon from '@icon/RefreshIcon';

import { GoogleFileResource, SyncStatus } from '@type/google-api';
import EditIcon from '@icon/EditIcon';
import CrossIcon from '@icon/CrossIcon';
import DeleteIcon from '@icon/DeleteIcon';

const GoogleSync = ({ clientId }: { clientId: string }) => {
  const { t } = useTranslation(['drive']);

  const fileId = useGStore((state) => state.fileId);
  const setFileId = useGStore((state) => state.setFileId);
  const googleAccessToken = useGStore((state) => state.googleAccessToken);
  const syncStatus = useGStore((state) => state.syncStatus);
  const cloudSync = useGStore((state) => state.cloudSync);
  const setSyncStatus = useGStore((state) => state.setSyncStatus);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(cloudSync);
  const [files, setFiles] = useState<GoogleFileResource[]>([]);

  const initialiseState = async (_googleAccessToken: string) => {
    const validated = await validateGoogleOath2AccessToken(_googleAccessToken);
    if (validated) {
      try {
        const _files = await getFiles(_googleAccessToken);
        if (_files) {
          setFiles(_files);
          if (_files.length === 0) {
            // _files is empty, create new file in google drive and set the file id
            const googleFile = await createDriveFile(
              stateToFile(),
              _googleAccessToken
            );
            setFileId(googleFile.id);
          } else {
            if (_files.findIndex((f) => f.id === fileId) !== -1) {
              // local storage file id matches one of the file ids returned
              setFileId(fileId);
            } else {
              // default set file id to the latest one
              setFileId(_files[0].id);
            }
          }
          useStore.persist.setOptions({
            storage: createGoogleCloudStorage(),
          });
          useStore.persist.rehydrate();
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
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <GoogleIcon /> {t('name')}
        {cloudSync && <SyncIcon status={syncStatus} />}
      </div>
      {isModalOpen && (
        <GooglePopup
          setIsModalOpen={setIsModalOpen}
          files={files}
          setFiles={setFiles}
        />
      )}
    </GoogleOAuthProvider>
  );
};

const GooglePopup = ({
  setIsModalOpen,
  files,
  setFiles,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  files: GoogleFileResource[];
  setFiles: React.Dispatch<React.SetStateAction<GoogleFileResource[]>>;
}) => {
  const { t } = useTranslation(['drive']);

  const syncStatus = useGStore((state) => state.syncStatus);
  const setSyncStatus = useGStore((state) => state.setSyncStatus);
  const cloudSync = useGStore((state) => state.cloudSync);
  const googleAccessToken = useGStore((state) => state.googleAccessToken);
  const setFileId = useGStore((state) => state.setFileId);

  const setToastStatus = useStore((state) => state.setToastStatus);
  const setToastMessage = useStore((state) => state.setToastMessage);
  const setToastShow = useStore((state) => state.setToastShow);

  const [_fileId, _setFileId] = useState<string>(
    useGStore.getState().fileId || ''
  );

  const createSyncFile = async () => {
    if (!googleAccessToken) return;
    try {
      setSyncStatus('syncing');
      await createDriveFile(stateToFile(), googleAccessToken);
      const _files = await getFiles(googleAccessToken);
      if (_files) setFiles(_files);
      setSyncStatus('synced');
    } catch (e: unknown) {
      setSyncStatus('unauthenticated');
      setToastMessage((e as Error).message);
      setToastShow(true);
      setToastStatus('error');
    }
  };

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
        {cloudSync && syncStatus !== 'unauthenticated' && (
          <div className='flex flex-col gap-2 items-center'>
            {files.map((file) => (
              <FileSelector
                id={file.id}
                name={file.name}
                _fileId={_fileId}
                _setFileId={_setFileId}
                setFiles={setFiles}
                key={file.id}
              />
            ))}
            {syncStatus !== 'syncing' && (
              <div className='flex gap-4 flex-wrap justify-center'>
                <div
                  className='btn btn-primary cursor-pointer'
                  onClick={async () => {
                    setFileId(_fileId);
                    await useStore.persist.rehydrate();
                    setToastStatus('success');
                    setToastMessage(t('toast.sync'));
                    setToastShow(true);
                    setIsModalOpen(false);
                  }}
                >
                  {t('button.confirm')}
                </div>
                <div
                  className='btn btn-neutral cursor-pointer'
                  onClick={createSyncFile}
                >
                  {t('button.create')}
                </div>
              </div>
            )}
            <div className='h-4 w-4'>
              {syncStatus === 'syncing' && <SyncIcon status='syncing' />}
            </div>
          </div>
        )}
        <p>{t('privacy')}</p>
      </div>
    </PopupModal>
  );
};

const FileSelector = ({
  name,
  id,
  _fileId,
  _setFileId,
  setFiles,
}: {
  name: string;
  id: string;
  _fileId: string;
  _setFileId: React.Dispatch<React.SetStateAction<string>>;
  setFiles: React.Dispatch<React.SetStateAction<GoogleFileResource[]>>;
}) => {
  const syncStatus = useGStore((state) => state.syncStatus);
  const setSyncStatus = useGStore((state) => state.setSyncStatus);

  const setToastStatus = useStore((state) => state.setToastStatus);
  const setToastMessage = useStore((state) => state.setToastMessage);
  const setToastShow = useStore((state) => state.setToastShow);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [_name, _setName] = useState<string>(name);

  const syncing = syncStatus === 'syncing';

  const updateFileName = async () => {
    if (syncing) return;
    setIsEditing(false);
    const accessToken = useGStore.getState().googleAccessToken;
    if (!accessToken) return;

    try {
      setSyncStatus('syncing');
      const newFileName = _name.endsWith('.json') ? _name : _name + '.json';
      await updateDriveFileName(newFileName, id, accessToken);
      const _files = await getFiles(accessToken);
      if (_files) setFiles(_files);
      setSyncStatus('synced');
    } catch (e: unknown) {
      setSyncStatus('unauthenticated');
      setToastMessage((e as Error).message);
      setToastShow(true);
      setToastStatus('error');
    }
  };

  const deleteFile = async () => {
    if (syncing) return;
    setIsDeleting(false);
    const accessToken = useGStore.getState().googleAccessToken;
    if (!accessToken) return;

    try {
      setSyncStatus('syncing');
      await deleteDriveFile(id, accessToken);
      const _files = await getFiles(accessToken);
      if (_files) setFiles(_files);
      setSyncStatus('synced');
    } catch (e: unknown) {
      setSyncStatus('unauthenticated');
      setToastMessage((e as Error).message);
      setToastShow(true);
      setToastStatus('error');
    }
  };

  return (
    <label
      className={`w-full flex items-center justify-between mb-2 gap-2 text-sm font-medium text-gray-900 dark:text-gray-300 ${
        syncing ? 'cursor-not-allowed opacity-40' : ''
      }`}
    >
      <input
        type='radio'
        checked={_fileId === id}
        className='w-4 h-4'
        onChange={() => {
          if (!syncing) _setFileId(id);
        }}
        disabled={syncing}
      />
      <div className='flex-1 text-left'>
        {isEditing ? (
          <input
            type='text'
            className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
            value={_name}
            onChange={(e) => {
              _setName(e.target.value);
            }}
          />
        ) : (
          <>
            {name} <div className='text-[10px] md:text-xs'>{`<${id}>`}</div>
          </>
        )}
      </div>
      {isEditing || isDeleting ? (
        <div className='flex gap-1'>
          <div
            className={`${syncing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => {
              if (isEditing) updateFileName();
              if (isDeleting) deleteFile();
            }}
          >
            <TickIcon />
          </div>
          <div
            className={`${syncing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => {
              if (!syncing) {
                setIsEditing(false);
                setIsDeleting(false);
              }
            }}
          >
            <CrossIcon />
          </div>
        </div>
      ) : (
        <div className='flex gap-1'>
          <div
            className={`${syncing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => {
              if (!syncing) setIsEditing(true);
            }}
          >
            <EditIcon />
          </div>
          <div
            className={`${syncing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => {
              if (!syncing) setIsDeleting(true);
            }}
          >
            <DeleteIcon />
          </div>
        </div>
      )}
    </label>
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
      <div className='bg-gray-600/80 rounded-full p-1 animate-spin'>
        <RefreshIcon className='h-2 w-2' />
      </div>
    ),
    synced: (
      <div className='bg-gray-600/80 rounded-full p-1'>
        <TickIcon className='h-2 w-2' />
      </div>
    ),
  };
  return statusToIcon[status] || null;
};

export default GoogleSync;
