import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PersonIcon from '@icon/PersonIcon';
import ApiMenu from '@components/ApiMenu';

const Config = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        className='btn btn-neutral gap-3'
        id='api-menu'
        onClick={() => setIsModalOpen(true)}
      >
        <PersonIcon />
        {t('api')}
      </button>
      {isModalOpen && <ApiMenu setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

export default Config;
