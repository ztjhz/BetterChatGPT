import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PopupModal from '@components/PopupModal';
import {TotalTokenCostDisplay} from '@components/Menu/MenuOptions/TotalTokenCost';
import TotalTokenCost from '@components/Menu/MenuOptions/TotalTokenCost';

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
          title="Accumulated Token Costs"
          cancelButton={false}
        >
          <>
            <div className="text-gray-700 dark:text-gray-300">
              <div className='p-3'>
                The AI model costs are tracked for your awareness, and to build healthy usage habits.<br/>
                The metrics are counted locally, and are per device/browser. You can reset at any time.
              </div>  
              <div className='p-3'>
                Long conversation threads are the primary driver of AI costs creep. With each message in the thread, the app is submitting the <u>entire thread history</u> (from the beginning) to the LLM model to evaluate. We recommend starting a new chat frequently to lighten the load.
              </div>
              <div className='p-3'>
                Consider smaller model (GPT 3.5) when questions are easy, you may not need full power.
              </div>
              <div className='p-3'>
                <b>The AI LLMs are helping us working effeciently; Use it as much as needed!</b>
              </div>  
              <div className='p-3'>
                <TotalTokenCost />
              </div>
              <div className='p-3'>
                If you use it so much that your monthly costs consistently exceed $30 USD per month,<br/>talk to your manager regarding alternative "unmetered" premium access options.
              </div>  
            </div>
          </>
        </PopupModal>
      )}
    </>
  );
};

export default TokensCostMenu;