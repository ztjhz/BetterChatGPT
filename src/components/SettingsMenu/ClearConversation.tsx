import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PopupModal from '@components/PopupModal';
import DeleteIcon from '@icon/DeleteIcon';
import useInitialiseNewChat from '@hooks/useInitialiseNewChat';

const ClearConversation = () => {
  const { t } = useTranslation();

  const initialiseNewChat = useInitialiseNewChat();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConfirm = () => {
    setIsModalOpen(false);
    initialiseNewChat();
  };

  return (
    <>
      <a
        className='items-center gap-3 btn btn-neutral cursor-pointer'
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
