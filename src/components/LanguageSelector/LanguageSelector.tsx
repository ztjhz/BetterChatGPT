import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DownChevronArrow from '@icon/DownChevronArrow';
import { languageCodeToName, selectableLanguages } from '@constants/language';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const [dropDown, setDropDown] = useState<boolean>(false);
  return (
    <div className='prose dark:prose-invert relative'>
      <button
        className='btn btn-neutral btn-small w-36 flex justify-between'
        type='button'
        onClick={() => setDropDown((prev) => !prev)}
      >
        {languageCodeToName[i18n.language as keyof typeof languageCodeToName] ??
          i18n.language}
        <DownChevronArrow />
      </button>
      <div
        id='dropdown'
        className={`${
          dropDown ? '' : 'hidden'
        } absolute top-100 bottom-100 z-10 bg-white rounded-lg shadow-xl border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800 opacity-90 w-36`}
      >
        <ul
          className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0 max-h-72 overflow-auto'
          aria-labelledby='dropdownDefaultButton'
        >
          {selectableLanguages.map((lang) => (
            <li
              className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer'
              onClick={() => {
                i18n.changeLanguage(lang);
                setDropDown(false);
              }}
              key={lang}
            >
              {languageCodeToName[lang]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;
