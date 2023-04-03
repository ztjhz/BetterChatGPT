import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import useStore from '@store/store';

import ExportIcon from '@icon/ExportIcon';
import downloadFile from '@utils/downloadFile';
import { getToday } from '@utils/date';
import PopupModal from '@components/PopupModal';
import {
  isLegacyImport,
  validateAndFixChats,
  validateExportV1,
} from '@utils/import';
import { ChatInterface, Folder, FolderCollection } from '@type/chat';
import Export, { ExportBase, ExportV1 } from '@type/export';

const ImportExportChat = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <a
        className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <ExportIcon className='w-4 h-4' />
        {t('import')} / {t('export')}
      </a>
      {isModalOpen && (
        <PopupModal
          title={`${t('import')} / ${t('export')}`}
          setIsModalOpen={setIsModalOpen}
          cancelButton={false}
        >
          <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
            <ImportChat />
            <ExportChat />
          </div>
        </PopupModal>
      )}
    </>
  );
};

const ImportChat = () => {
  const { t } = useTranslation();
  const setChats = useStore.getState().setChats;
  const setFolders = useStore.getState().setFolders;
  const inputRef = useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const handleFileUpload = () => {
    if (!inputRef || !inputRef.current) return;
    const file = inputRef.current.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = event.target?.result as string;

        try {
          const parsedData = JSON.parse(data);
          if (isLegacyImport(parsedData)) {
            if (validateAndFixChats(parsedData)) {
              // import new folders
              const folderNameToIdMap: Record<string, string> = {};
              const parsedFolders: string[] = [];

              parsedData.forEach((data) => {
                const folder = data.folder;
                if (folder) {
                  if (!parsedFolders.includes(folder)) {
                    parsedFolders.push(folder);
                    folderNameToIdMap[folder] = uuidv4();
                  }
                  data.folder = folderNameToIdMap[folder];
                }
              });

              const newFolders: FolderCollection = parsedFolders.reduce(
                (acc, curr, index) => {
                  const id = folderNameToIdMap[curr];
                  const _newFolder: Folder = {
                    id,
                    name: curr,
                    expanded: false,
                    order: index,
                  };
                  return { [id]: _newFolder, ...acc };
                },
                {}
              );

              // increment the order of existing folders
              const offset = parsedFolders.length;

              const updatedFolders = useStore.getState().folders;
              Object.values(updatedFolders).forEach((f) => (f.order += offset));

              setFolders({ ...newFolders, ...updatedFolders });

              // import chats
              const prevChats = useStore.getState().chats;
              if (prevChats) {
                const updatedChats: ChatInterface[] = JSON.parse(
                  JSON.stringify(prevChats)
                );
                setChats(parsedData.concat(updatedChats));
              } else {
                setChats(parsedData);
              }
              setAlert({ message: 'Succesfully imported!', success: true });
            } else {
              setAlert({
                message: 'Invalid chats data format',
                success: false,
              });
            }
          } else {
            switch ((parsedData as ExportBase).version) {
              case 1:
                if (validateExportV1(parsedData)) {
                  // import folders
                  parsedData.folders;
                  // increment the order of existing folders
                  const offset = Object.keys(parsedData.folders).length;

                  const updatedFolders = useStore.getState().folders;
                  Object.values(updatedFolders).forEach(
                    (f) => (f.order += offset)
                  );

                  setFolders({ ...parsedData.folders, ...updatedFolders });

                  // import chats
                  const prevChats = useStore.getState().chats;
                  if (parsedData.chats) {
                    if (prevChats) {
                      const updatedChats: ChatInterface[] = JSON.parse(
                        JSON.stringify(prevChats)
                      );
                      setChats(parsedData.chats.concat(updatedChats));
                    } else {
                      setChats(parsedData.chats);
                    }
                  }

                  setAlert({ message: 'Succesfully imported!', success: true });
                } else {
                  setAlert({
                    message: 'Invalid format',
                    success: false,
                  });
                }
                break;
            }
          }
        } catch (error: unknown) {
          setAlert({ message: (error as Error).message, success: false });
        }
      };

      reader.readAsText(file);
    }
  };
  return (
    <>
      <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
        {t('import')} (JSON)
      </label>
      <input
        className='w-full text-sm file:p-2 text-gray-800 file:text-gray-700 dark:text-gray-300 dark:file:text-gray-200 rounded-md cursor-pointer focus:outline-none bg-gray-50 file:bg-gray-100 dark:bg-gray-800 dark:file:bg-gray-700 file:border-0 border border-gray-300 dark:border-gray-600 placeholder-gray-900 dark:placeholder-gray-300 file:cursor-pointer'
        type='file'
        ref={inputRef}
      />
      <button
        className='btn btn-small btn-primary mt-3'
        onClick={handleFileUpload}
      >
        {t('import')}
      </button>
      {alert && (
        <div
          className={`relative py-2 px-3 w-full mt-3 border rounded-md text-gray-600 dark:text-gray-100 text-sm whitespace-pre-wrap ${
            alert.success
              ? 'border-green-500 bg-green-500/10'
              : 'border-red-500 bg-red-500/10'
          }`}
        >
          {alert.message}
        </div>
      )}
    </>
  );
};

const ExportChat = () => {
  const { t } = useTranslation();

  return (
    <div className='mt-6'>
      <div className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
        {t('export')} (JSON)
      </div>
      <button
        className='btn btn-small btn-primary'
        onClick={() => {
          const fileData: Export = {
            chats: useStore.getState().chats,
            folders: useStore.getState().folders,
            version: 1,
          };
          downloadFile(fileData, getToday());
        }}
      >
        {t('export')}
      </button>
    </div>
  );
};

export default ImportExportChat;
