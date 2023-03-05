import React, { useEffect, useState } from 'react';
import useStore from '@store/store';

import CrossIcon2 from '@icon/CrossIcon2';
import { validateApiKey } from '@api/customApi';

const ConfigMenu = () => {
  const apiKey = useStore((state) => state.apiKey);
  const setApiKey = useStore((state) => state.setApiKey);
  const apiFree = useStore((state) => state.apiFree);
  const setApiFree = useStore((state) => state.setApiFree);
  const openConfig = useStore((state) => state.openConfig);
  const setOpenConfig = useStore((state) => state.setOpenConfig);

  const [_apiKey, _setApiKey] = useState<string>(apiKey || '');
  const [error, setError] = useState<boolean>(false);

  const handleSave = async () => {
    if (apiFree === true) {
      setOpenConfig(false);
    } else {
      const valid = await validateApiKey(_apiKey);

      if (valid) {
        setApiKey(_apiKey);
        setError(false);
        setOpenConfig(false);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    }
  };

  const handleClose = () => {
    setOpenConfig(false);
  };

  useEffect(() => {
    if (apiKey) {
      setApiFree(false);
      _setApiKey(apiKey);
    }
  }, []);

  return openConfig ? (
    <div className='fixed top-0 left-0 z-[999] w-full p-4 overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-gray-800/90'>
      <div className='relative w-full h-full max-w-2xl md:h-auto'>
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div className='flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600'>
            <h3 className='ml-2 text-lg font-semibold text-gray-900 dark:text-white'>
              Config
            </h3>
            <button
              type='button'
              className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
              onClick={handleClose}
            >
              <CrossIcon2 />
            </button>
          </div>
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
                    Invalid API key!
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
              We prioritize the security of your API key and handle it with
              utmost care. Your key is exclusively stored on your browser and
              never shared with any third-party entity. It is solely used for
              the intended purpose of accessing the OpenAI API and not for any
              other unauthorized use.
            </div>
          </div>

          <div className='flex items-center justify-center p-6 gap-4'>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type='button'
              className='btn btn-neutral'
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ConfigMenu;
