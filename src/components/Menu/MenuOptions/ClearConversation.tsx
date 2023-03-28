import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';
import DeleteIcon from '@icon/DeleteIcon';
import useInitialiseNewChat from '@hooks/useInitialiseNewChat';

const ClearConversation = () => {
  const { t } = useTranslation();

  const initialiseNewChat = useInitialiseNewChat();
  const setFoldersName = useStore((state) => state.setFoldersName);
  const setFoldersExpanded = useStore((state) => state.setFoldersExpanded);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConfirm = () => {
    setIsModalOpen(false);
    setFoldersName([]);
    setFoldersExpanded([]);
    initialiseNewChat();
  };

  return (
    <>
      <a
        className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <DeleteIcon />
        {t('clearConversation')}
      </a>
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('warning') as string}
          message={t('clearConversationWarning') as string}
          handleConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default ClearConversation;
