import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';

const NewFolder = () => {
  const { t } = useTranslation();
  const generating = useStore((state) => state.generating);
  const setFoldersName = useStore((state) => state.setFoldersName);

  const addFolder = () => {
    let folderIndex = 1;
    let name = `New Folder ${folderIndex}`;

    while (
      useStore
        .getState()
        .foldersName.some((_folderName) => _folderName === name)
    ) {
      folderIndex += 1;
      name = `New Folder ${folderIndex}`;
    }

    setFoldersName([name, ...useStore.getState().foldersName]);
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
