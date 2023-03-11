import React, { useEffect, useState } from 'react';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';

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
  const apiFreeEndpoint = useStore((state) => state.apiFreeEndpoint);
  const setApiFreeEndpoint = useStore((state) => state.setApiFreeEndpoint);

  const [_apiFree, _setApiFree] = useState<boolean>(apiFree);
  const [_apiKey, _setApiKey] = useState<string>(apiKey || '');
  const [_apiFreeEndpoint, _setApiFreeEndpoint] =
    useState<string>(apiFreeEndpoint);

  const handleSave = async () => {
    if (_apiFree === true) {
      setApiFreeEndpoint(_apiFreeEndpoint);
      setApiFree(true);
      setIsModalOpen(false);
    } else {
      setApiKey(_apiKey);
      setApiFree(false);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (apiKey) {
      setApiFree(false);
      _setApiFree(false);
      _setApiKey(apiKey);
    }
  }, []);

  const handleClose = () => {
    _setApiFree(apiFree);
    _setApiFreeEndpoint(apiFreeEndpoint);
    apiKey && _setApiKey(apiKey);
  };

  return isModalOpen ? (
    <PopupModal
      title='API'
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
      handleClose={handleClose}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
        <div className='flex items-center mb-2'>
          <input
            type='radio'
            checked={_apiFree === true}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            onChange={() => _setApiFree(true)}
          />
          <label className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
            Use free API endpoint
          </label>
        </div>

        {_apiFree && (
          <div className='mt-2 mb-6'>
            <div className='text-sm font-medium text-gray-900 dark:text-gray-300 mb-2'>
              Use free API endpoint from{' '}
              <a
                href='https://github.com/ayaka14732/ChatGPTAPIFree'
                className='underline dark:hover:text-white hover:text-black'
                target='_blank'
              >
                Ayaka
              </a>
              : https://chatgpt-api-huuz62kfra-as.a.run.app/v1/ or enter your own API endpoint
            </div>
            <div className='flex gap-2 items-center justify-center'>
              <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
                Free API Endpoint
              </div>
              <input
                type='text'
                className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                value={_apiFreeEndpoint}
                placeholder='https://chatgpt-api-huuz62kfra-as.a.run.app/v1/'
                onChange={(e) => {
                  _setApiFreeEndpoint(e.target.value);
                }}
              />
            </div>
          </div>
        )}

        <div className='flex items-center'>
          <input
            type='radio'
            checked={_apiFree === false}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            onChange={() => _setApiFree(false)}
          />
          <label className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
            Use your own API key
          </label>
        </div>

        {_apiFree === false && (
          <div className='flex gap-2 items-center justify-center mt-2'>
            <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
              API Key
            </div>
            <input
              type='text'
              className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
              value={_apiKey}
              onChange={(e) => {
                _setApiKey(e.target.value);
              }}
            />
          </div>
        )}

        <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm mt-4 text-center'>
          Get your personal API key{' '}
          <a
            className='link'
            href='https://platform.openai.com/account/api-keys'
            target='_blank'
          >
            here
          </a>
        </div>
        <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm mt-4'>
          We prioritise the security of your API key and handle it with utmost
          care. Your key is exclusively stored on your browser and never shared
          with any third-party entity. It is solely used for the intended
          purpose of accessing the OpenAI API and not for any other unauthorised
          use.
        </div>
      </div>
    </PopupModal>
  ) : (
    <></>
  );
};

export default ApiMenu;
