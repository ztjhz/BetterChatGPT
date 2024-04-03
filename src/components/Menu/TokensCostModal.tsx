import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PopupModal from '@components/PopupModal';
import {TotalTokenCostDisplay} from '@components/Menu/TokensTotalCost';
import TokensTotalCost from '@components/Menu/TokensTotalCost';

const TokensCostModal = () => {
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
          title={t('accumulatedCost') as string}
          cancelButton={false}
        >
          <>
            <div className="text-gray-700 dark:text-gray-300">
              <div className='p-3'>
                {t("accumulatedCostPreambleProse.div1") as string}
              </div>  
              <div className='p-3'>
                {t("accumulatedCostPreambleProse.div2") as string}
              </div>  
              <div className='p-3'>
                {t("accumulatedCostPreambleProse.div3") as string}
              </div>
              <div className='p-3'>
                {t("accumulatedCostPreambleProse.div4") as string} 
              </div>
              <div className='p-3'>
                {t("accumulatedCostPreambleProse.div5") as string}
              </div>
              <div className='p-3'>
                <b>{t("accumulatedCostPreambleProse.div6") as string}</b>
              </div>  
              <div className='p-3'>
                <TokensTotalCost />
              </div>
            </div>
          </>
        </PopupModal>
      )}
    </>
  );
};

export default TokensCostModal;