import React from 'react';
import { useTranslation } from 'react-i18next';

import useStore from '@store/store';

import downloadFile from '@utils/downloadFile';
import { getToday } from '@utils/date';

import Export from '@type/export';

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
export default ExportChat;
