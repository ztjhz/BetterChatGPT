import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ExportIcon from '@icon/ExportIcon';
import PopupModal from '@components/PopupModal';

import ImportChat from './ImportChat';
import ExportChat from './ExportChat';
import ImportChatOpenAI from './ImportChatOpenAI';

const ImportExportChat = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button className='btn btn-neutral gap-3'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
      <ExportIcon className='w-4 h-4' />
        {t('import')} / {t('export')} {t('data')}
      </button>
      {isModalOpen && (
        <PopupModal
          title={`${t('import')} / ${t('export')} ${t('data')}`}
          setIsModalOpen={setIsModalOpen}
          cancelButton={false}
        >
          <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
            <ImportChat />
            <ExportChat />
            <div className='border-t my-3 border-gray-200 dark:border-gray-600' />
            <ImportChatOpenAI setIsModalOpen={setIsModalOpen} />
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default ImportExportChat;
