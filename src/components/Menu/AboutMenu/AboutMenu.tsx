import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PopupModal from '@components/PopupModal';
import AboutIcon from '@icon/AboutIcon';

const AboutMenu = () => {
  const { t } = useTranslation(['main', 'about']);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const companyName:string = import.meta.env.VITE_COMPANY_NAME || "";

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
              <p>This is a {companyName}-provided AI LLM Assistant application. Use it to optimize your work.</p>
              <p>The UI is based on  the <b>BetterChatGPT project by Jing Hua</b>, customized to <b>{companyName}</b> needs. </p>
              <p>Our fork on GitHub: <a href='https://github.com/DmitriyAlergant-T1A/BetterChatGPT-t1a' target='_blank' className='link'>https://github.com/DmitriyAlergant-T1A/BetterChatGPT-t1a</a><br/>
              Issues and GitHub Pull Requests (enhancements) from volunteer contributors are appreciated. </p>
              <>
                <h2 className='text-lg font-bold'>
                  {t('support.title', { ns: 'about' })}
                </h2>
                <p>For technical support (access, errors, etc.), create a {companyName} HelpDesk ticket of the "IT" type<br/>
                For UI product bugs or defects, consider using the GitHub Issues mechanism (repository link above)</p>
              </>

              <h2 className='text-lg font-bold'>{t('privacyStatement.title', { ns: 'about' })}</h2>
              <p>This tool is provided strictly for {companyName} business use</p>
              <p><b>We do not</b> collect or retain logs of your prompt requests (<b>what</b> you wrote) or model responses.</p>
              <p><b>We do</b> collect technical statistics of individual usage: number of requests, timing, sizes, costs, etc.</p>
              <p>Ther 3rd party LLM API providers (OpenAI, Anthropic) claim not to retain logs of API requests for longer then 30 days, and to NOT use these inputs for future LLM models training.</p>

              {/* <p>{t('privacyStatement.paragraph2', { ns: 'about' })}</p> */}
            </div>
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default AboutMenu;
