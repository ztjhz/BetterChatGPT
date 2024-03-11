import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PopupModal from '@components/PopupModal';
import {TotalTokenCostDisplay} from '@components/SettingsMenu/TotalTokenCost';
import TotalTokenCost from '@components/SettingsMenu/TotalTokenCost';

const TokensCostMenu = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <a
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={() => setIsModalOpen(true)}
      >
        <TotalTokenCostDisplay />        
      </a>
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title="Accumulated Token Costs per Model"
          cancelButton={false}
        >
          <div className='p-6'>
            <TotalTokenCost />
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default TokensCostMenu;