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
        onClick={() => setIsModalOpen(true)}
      >
        <div>
          <AboutIcon />
        </div>
        About
      </a>
      {isModalOpen && (
        <PopupModal
          title="About"
          setIsModalOpen={setIsModalOpen}
          cancelButton={false}
        >
          <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
            <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm flex flex-col gap-3 leading-relaxed'>
              <p>
                This project is forked from Better ChatGPT and built off work by Jing Hua, Antonio Cheong, and many others in the community.
              </p>
              <p>
                Source code: <br />
                <a href='https://github.com/TanGentleman/BetterChatGPT' target='_blank'>https://github.com/TanGentleman/BetterChatGPT</a>
              </p>
              <h2 className='text-lg font-bold'>My proxy endpoint does not log any messages and the source code of the docker instance can be found on my Github page.</h2>
            </div>
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default AboutMenu;



