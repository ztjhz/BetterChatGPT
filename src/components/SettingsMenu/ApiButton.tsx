import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PersonIcon from '@icon/PersonIcon';
import ApiMenu from '@components/SettingsMenu/ApiMenu';

const ApiButton = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        className='items-center gap-3 btn btn-neutral'
        id='api-menu'
        onClick={() => setIsModalOpen(true)}
        aria-label={t('apiSettings') as string}
      >
        <PersonIcon />
        {t('apiSettings')}
      </button>
      {isModalOpen && <ApiMenu setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

export default ApiButton;
