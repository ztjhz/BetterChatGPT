import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';

const ApiMenu = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation(['main', 'api']);

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
      title={t('api') as string}
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
            {t('apiEndpoint.option', { ns: 'api' })}
          </label>
        </div>

        {_apiFree && (
          <div className='mt-2 mb-6'>
            <div className='text-sm font-medium text-gray-900 dark:text-gray-300 mb-2'>
              <Trans
                i18nKey='apiEndpoint.description'
                ns='api'
                components={[
                  <a
                    href='https://github.com/ayaka14732/ChatGPTAPIFree'
                    className='link'
                    target='_blank'
                  />,
                ]}
              />
            </div>
            <div className='flex gap-2 items-center justify-center'>
              <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
                {t('apiEndpoint.inputLabel', { ns: 'api' })}
              </div>
              <input
                type='text'
                className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                value={_apiFreeEndpoint}
                placeholder='https://chatgpt-api.shn.hk/v1/'
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
            {t('apiKey.option', { ns: 'api' })}
          </label>
        </div>

        {_apiFree === false && (
          <div className='flex gap-2 items-center justify-center mt-2'>
            <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
              {t('apiEndpoint.inputLabel', { ns: 'api' })}
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
          <Trans
            i18nKey='apiKey.howTo'
            ns='api'
            components={[
              <a
                href='https://platform.openai.com/account/api-keys'
                className='link'
                target='_blank'
              />,
            ]}
          />
        </div>
        <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm mt-4'>
          {t('securityMessage', { ns: 'api' })}
        </div>
      </div>
    </PopupModal>
  ) : (
    <></>
  );
};

export default ApiMenu;
