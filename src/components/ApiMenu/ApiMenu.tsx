import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';
import { availableEndpoints, defaultAPIEndpoint } from '@constants/auth';
import DownChevronArrow from '@icon/DownChevronArrow';

const ApiMenu = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation(['main', 'api']);

  const apiKey = useStore((state) => state.apiKey);
  const setApiKey = useStore((state) => state.setApiKey);
  const apiFree = useStore((state) => state.apiFree);
  const setApiFree = useStore((state) => state.setApiFree);
  const apiEndpoint = useStore((state) => state.apiEndpoint);
  const setApiEndpoint = useStore((state) => state.setApiEndpoint);

  const [_apiFree, _setApiFree] = useState<boolean>(apiFree);
  const [_apiKey, _setApiKey] = useState<string>(apiKey || '');
  const [_apiEndpoint, _setApiEndpoint] = useState<string>(apiEndpoint);
  const [_customEndpoint, _setCustomEndpoint] = useState<boolean>(
    !availableEndpoints.includes(apiEndpoint)
  );

  const handleSave = () => {
    setApiFree(_apiFree);
    setApiKey(_apiKey);
    setApiEndpoint(_apiEndpoint);
    setIsModalOpen(false);
  };

  const handleToggleCustomEndpoint = () => {
    if (_customEndpoint) _setApiEndpoint(defaultAPIEndpoint);
    else _setApiEndpoint('');
    _setCustomEndpoint((prev) => !prev);
  };

  return (
    <PopupModal
      title={t('api') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
        <label className='flex gap-2 text-gray-900 dark:text-gray-300 text-sm items-center mb-4'>
          <input
            type='checkbox'
            checked={_customEndpoint}
            className='w-4 h-4'
            onChange={handleToggleCustomEndpoint}
          />
          {t('customEndpoint', { ns: 'api' })}
        </label>

        <div className='flex gap-2 items-center justify-center mb-6'>
          <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
            {t('apiEndpoint.inputLabel', { ns: 'api' })}
          </div>
          {_customEndpoint ? (
            <input
              type='text'
              className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
              value={_apiEndpoint}
              placeholder='https://chatgpt-api.shn.hk/v1/'
              onChange={(e) => {
                _setApiEndpoint(e.target.value);
              }}
            />
          ) : (
            <ApiEndpointSelector
              _apiEndpoint={_apiEndpoint}
              _setApiEndpoint={_setApiEndpoint}
            />
          )}
        </div>

        <label className='flex items-center mb-2 gap-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
          <input
            type='radio'
            checked={_apiFree === true}
            className='w-4 h-4'
            onChange={() => _setApiFree(true)}
          />
          {t('apiEndpoint.option', { ns: 'api' })}
        </label>

        <label className='flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
          <input
            type='radio'
            checked={_apiFree === false}
            className='w-4 h-4'
            onChange={() => _setApiFree(false)}
          />
          {t('apiKey.option', { ns: 'api' })}
        </label>

        {_apiFree === false && (
          <div className='flex gap-2 items-center justify-center mt-2'>
            <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
              {t('apiKey.inputLabel', { ns: 'api' })}
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

        <div className='mt-4 p-1 border border-gray-500 rounded-md text-sm font-medium text-gray-900 dark:text-gray-300 text-center'>
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
        <div className='mt-4 p-1 border border-gray-500 rounded-md text-sm font-medium text-gray-900 dark:text-gray-300 text-center'>
          <Trans
            i18nKey='shareGPT'
            ns='api'
            components={[
              <a
                href='https://github.com/acheong08/ShareGPT'
                className='link'
                target='_blank'
              />,
            ]}
          />
        </div>
      </div>
    </PopupModal>
  );
};

const ApiEndpointSelector = ({
  _apiEndpoint,
  _setApiEndpoint,
}: {
  _apiEndpoint: string;
  _setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [dropDown, setDropDown] = useState<boolean>(false);

  return (
    <div className='w-full relative'>
      <button
        className='btn btn-neutral btn-small flex w-32 flex justify-between w-full'
        type='button'
        onClick={() => setDropDown((prev) => !prev)}
      >
        {_apiEndpoint}
        <DownChevronArrow />
      </button>
      <div
        id='dropdown'
        className={`${
          dropDown ? '' : 'hidden'
        } absolute top-100 bottom-100 z-10 bg-white rounded-lg shadow-xl border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800 opacity-90 w-32 w-full`}
      >
        <ul
          className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0'
          aria-labelledby='dropdownDefaultButton'
        >
          {availableEndpoints.map((endpoint) => (
            <li
              className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer'
              onClick={() => {
                _setApiEndpoint(endpoint);
                setDropDown(false);
              }}
              key={endpoint}
            >
              {endpoint}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApiMenu;
