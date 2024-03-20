import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';
import DeleteIcon from '@icon/DeleteIcon';
import useInitialiseNewChat from '@hooks/useInitialiseNewChat';

const ClearConversation = () => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const setFolders = useStore((state) => state.setFolders);
  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  
  const handleConfirm = () => 
  {
    setFolders({});
    setChats([]);
    setCurrentChatIndex(0);    

    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className='items-center gap-3 btn btn-neutral'
        onClick={() => {
          setIsModalOpen(true);
        }}
        aria-label={t('clearConversation') as string}
      >
        <DeleteIcon />
        {t('clearConversation')}
      </button>
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
