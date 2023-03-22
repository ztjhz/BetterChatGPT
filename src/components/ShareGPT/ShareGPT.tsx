import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';
import { submitShareGPT } from '@api/api';
import { ShareGPTSubmitBodyInterface } from '@type/api';

const ShareGPT = React.memo(() => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConfirm = async () => {
    const chats = useStore.getState().chats;
    const currentChatIndex = useStore.getState().currentChatIndex;
    if (chats) {
      const items: ShareGPTSubmitBodyInterface['items'] = chats[
        currentChatIndex
      ].messages.map((message) => ({
        from: 'gpt',
        value: `<p><b>${t(message.role)}</b></p>${message.content}`,
      }));
      try {
        await submitShareGPT({
          avatarUrl: '',
          items,
        });
        setIsModalOpen(false);
      } catch (e: unknown) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <button
        className='btn btn-neutral'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {t('postOnShareGPT.title')}
      </button>
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('postOnShareGPT.title') as string}
          message={t('postOnShareGPT.warning') as string}
          handleConfirm={handleConfirm}
        />
      )}
    </>
  );
});

export default ShareGPT;
