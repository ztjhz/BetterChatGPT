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
              <h2 className='text-lg font-bold'>About</h2>
              <p>
                BetterGPT is an upgraded ChatGPT interface with more AI models
                and free access to GPT-4 and no sign up is required!
              </p>

              <>
                <h2 className='text-lg font-bold'>
                  {t('support.title', { ns: 'about' })}
                </h2>

                <p>
                  Without donations, this site would have to rely on ads. Who
                  likes seeing ads?
                </p>

                <p>
                  Maintaining a service like this is expensive with OpenAI API
                  costs and web-hosting costs. Every little donation helps!
                </p>

                <p>
                  If you'd like to contribute, all sponsors will be shown and
                  recognised on the page. DM me @chromed.exe on Discord to
                  notify me.
                </p>

                <div className='flex flex-col items-center gap-4 my-4'>
                  <div className='flex gap-x-10 gap-y-4 flex-wrap justify-center'>
                    <div className='flex flex-col items-center justify-center gap-1'>
                      <div>Crypto Address</div>
                      <img
                        className='rounded-md w-32 h-32'
                        src='https://storage.googleapis.com/openscreenshot/G%2FN%2F3/ebFwj53NG.png'
                        alt='Support me with Ethereum'
                      />
                      <p>0xFA29D00BA9F64C9a5eb2F1153e7Df37161AF3c97</p>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default AboutMenu;
