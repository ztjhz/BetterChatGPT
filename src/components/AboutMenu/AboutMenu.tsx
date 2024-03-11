import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PopupModal from '@components/PopupModal';
import AboutIcon from '@icon/AboutIcon';

const AboutMenu = () => {
  const { t } = useTranslation(['main', 'about']);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <a
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <div>
          <AboutIcon />
        </div>
        {t('about')}
      </a>
      {isModalOpen && (
        <PopupModal
          title={t('about') as string}
          setIsModalOpen={setIsModalOpen}
          cancelButton={false}
        >
          <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
            <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm flex flex-col gap-3 leading-relaxed'>
              <p>This is a T1A-provided AI LLM Assistant application. Use it to optimize your work.</p>
              <p>The UI is based on  the BetterChatGPT project, customized to T1A needs.<br/>Check it on GitHub: <a href='https://github.com/ztjhz/BetterChatGPT' target='_blank' className='link'>https://github.com/ztjhz/BetterChatGPT</a></p>
              
              <>
                <h2 className='text-lg font-bold'>
                  {t('support.title', { ns: 'about' })}
                </h2>
                <p>For support, contact Dmitriy Alergant (for now).</p>
              </>

              <h2 className='text-lg font-bold'>Privacy Policy</h2>
              <p>This tool is provided strictly for T1A business use</p>
              <p>We (<b>do or do not?</b>) retain request logs of your prompts and API model resopnses.</p>
              <p>We do collect statistics on individual usage: number of requests, their sizes, total costs, etc.</p>
              <p>Ther 3rd party API providers (OpenAI) claim not to retain our API requests over 30 days,<br/> and not to use these inputs for future LLM models training.</p>

              {/* <p>{t('privacyStatement.paragraph2', { ns: 'about' })}</p> */}
            </div>
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default AboutMenu;
