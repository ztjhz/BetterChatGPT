import React, { useEffect, useState } from 'react';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';
import { validateApiKey } from '@api/customApi';

const ApiMenu = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const apiKey = useStore((state) => state.apiKey);
  const setApiKey = useStore((state) => state.setApiKey);
  const apiFree = useStore((state) => state.apiFree);
  const setApiFree = useStore((state) => state.setApiFree);

  const [_apiKey, _setApiKey] = useState<string>(apiKey || '');
  const [error, setError] = useState<boolean>(false);

  const handleSave = async () => {
    if (apiFree === true) {
      setIsModalOpen(false);
    } else {
      const valid = await validateApiKey(_apiKey);

      if (valid) {
        setApiKey(_apiKey);
        setError(false);
        setIsModalOpen(false);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (apiKey) {
      setApiFree(false);
      _setApiKey(apiKey);
    }
  }, []);

  return isModalOpen ? (
    <PopupModal
      title='API'
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
        <div className='flex items-center mb-2'>
          <input
            type='radio'
            checked={apiFree === true}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            onChange={() => setApiFree(true)}
          />
          <label className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
            Use free API from{' '}
            <a
              href='https://github.com/ayaka14732/ChatGPTAPIFree'
              className='underline dark:hover:text-white hover:text-black'
              target='_blank'
            >
              Ayaka
            </a>
          </label>
        </div>

        <div className='flex items-center'>
          <input
            type='radio'
            checked={apiFree === false}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            onChange={() => setApiFree(false)}
          />
          <label className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
            Use your own API key
          </label>
        </div>

        {apiFree === false && (
          <>
            <div className='flex gap-2 items-center justify-center mt-2'>
              <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
                API Key
              </div>
              <input
                type='text'
                className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md p-0 m-0 w-full mr-0 h-8 focus:outline-none'
                value={_apiKey}
                onChange={(e) => {
                  _setApiKey(e.target.value);
                }}
              />
            </div>
            {error && (
              <div className='bg-red-600/50 p-2 rounded-sm mt-3 text-gray-900 dark:text-gray-300 text-sm'>
                Error: Invalid API key or network blocked. Please check your API key and network settings for OpenAI API.
              </div>
            )}
          </>
        )}

        <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm mt-4 text-center'>
          Get your personal API key{' '}
          <a
            className='underline dark:hover:text-white hover:text-black'
            href='https://platform.openai.com/account/api-keys'
            target='_blank'
          >
            here
          </a>
        </div>
        <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm mt-4'>
          We prioritize the security of your API key and handle it with utmost
          care. Your key is exclusively stored on your browser and never shared
          with any third-party entity. It is solely used for the intended
          purpose of accessing the OpenAI API and not for any other unauthorized
          use.
        </div>
      </div>
    </PopupModal>
  ) : (
    <></>
  );
};

export default ApiMenu;
