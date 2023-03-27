import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';

import { ChatHistoryFolderInterface } from '@type/chat';

const NewFolder = ({
  setFolders,
}: {
  setFolders: React.Dispatch<React.SetStateAction<ChatHistoryFolderInterface>>;
}) => {
  const { t } = useTranslation();
  const generating = useStore((state) => state.generating);

  const addFolder = () => {
    setFolders((prev) => {
      let folderIndex = 1;
      while (
        Object.keys(prev).some(
          (_folderName) => _folderName === `New Folder ${folderIndex}`
        )
      ) {
        folderIndex += 1;
      }

      const updatedFolders: ChatHistoryFolderInterface = JSON.parse(
        JSON.stringify(prev)
      );

      return { [`New Folder ${folderIndex}`]: [], ...updatedFolders };
    });
  };

  return (
    <a
      className={`max-md:hidden flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white text-sm md:mb-2 flex-shrink-0 md:border md:border-white/20 transition-opacity ${
        generating
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer opacity-100'
      }`}
      onClick={() => {
        if (!generating) addFolder();
      }}
    >
      <PlusIcon />{' '}
      <span className='hidden md:inline-flex text-white text-sm'>
        {t('newFolder')}
      </span>
    </a>
  );
};

export default NewFolder;
