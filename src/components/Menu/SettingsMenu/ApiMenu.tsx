import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useStore from '@store/store';

import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';

import PopupModal from '@components/PopupModal';

import {officialAPIEndpoint, builtinAPIEndpoint, availableEndpoints} from '@constants/auth'

import DownChevronArrow from '@icon/DownChevronArrow';

const ApiMenu = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation(['main', 'api']);

  const companyName:string = import.meta.env.VITE_COMPANY_NAME || "";

  const apiKey = useStore((state) => state.apiKey);
  const setApiKey = useStore((state) => state.setApiKey);
  const apiEndpoint = useStore((state) => state.apiEndpoint);
  const setApiEndpoint = useStore((state) => state.setApiEndpoint);

  const [_apiKey, _setApiKey] = useState<string>(apiKey || '');
  const [_apiEndpoint, _setApiEndpoint] = useState<string>(apiEndpoint);
  const [_builtinEndpoint, _setCustomEndpoint] = useState<boolean>(
    !availableEndpoints.includes(apiEndpoint)
  );

  const handleSave = () => {
    setApiKey(_apiKey);
    setApiEndpoint(_apiEndpoint);
    setIsModalOpen(false);
  };

  const handleToggleCustomEndpoint = (value: string) => {
    const isCustom = value === 'built-in';
    if (isCustom) {
      _setApiEndpoint(builtinAPIEndpoint);
    } else {
      _setApiEndpoint(officialAPIEndpoint);
    }
    _setCustomEndpoint(isCustom);
  };
  

  return (
    <PopupModal
      title={t('api') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
        <div className='flex gap-2 items-center mb-6'>
          <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
            API Endpoint Type
          </div>
          <select
            className='text-gray-800 dark:text-white p-1 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
            value={_builtinEndpoint ? 'built-in' : 'direct'}
            onChange={(e) => handleToggleCustomEndpoint(e.target.value)}
          >
            <option value="built-in">{companyName}-Provided Endpoint</option>
            <option value="direct">Direct Endpoint</option>
          </select>
        </div>

        <div className='flex gap-2 items-center mb-6'>
          {_builtinEndpoint ? (
            <input
              type='text'
              className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
              readOnly
              hidden
              value={_apiEndpoint}
              onChange={(e) => {
                _setApiEndpoint(e.target.value);
              }}
            />
          ) : (
            <>
              <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
                {t('apiEndpoint.inputLabel', { ns: 'api' })}
              </div>
              <ApiEndpointSelector
                _apiEndpoint={_apiEndpoint}
                _setApiEndpoint={_setApiEndpoint}
              />
            </>
          )}
        </div>

        {_builtinEndpoint || (
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

        <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm flex flex-col gap-3 leading-relaxed'>
          {/* <p className='mt-4'>
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
          </p> */}

          <p></p>

          {_builtinEndpoint ? 
            (
            <p>The {companyName}-Provided API endpoint is an integral part of this application, and does not require an API Key</p>
            )
            :
            (
            <p>You have to provide your own API Key to directly connect to the "official" OpenAI endpoint.<br/>The API Key will only be stored on your browser.</p>
            )
          }
          {/* <p>{t('securityMessage', { ns: 'api' })}</p>

          <p>{t('apiEndpoint.description', { ns: 'api' })}</p>

          <p>{t('apiEndpoint.warn', { ns: 'api' })}</p> */}
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
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

  return (
    <div className='w-[40vw] relative flex-1'>
      <button
        className='btn btn-neutral btn-small flex justify-between w-full'
        type='button'
        aria-label='expand api menu'
        onClick={() => setDropDown((prev) => !prev)}
      >
        <span className='truncate'>{_apiEndpoint}</span>
        <DownChevronArrow />
      </button>
      <div
        id='dropdown'
        ref={dropDownRef}
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
              className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer truncate'
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
