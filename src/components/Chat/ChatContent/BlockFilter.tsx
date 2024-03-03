import React, { useState } from 'react';
import useStore from '@store/store';
import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';
import DownChevronArrow from '@icon/DownChevronArrow';
import { useTranslation } from 'react-i18next';

const BlockFilter = () => {
  const { t } = useTranslation();
  const setBlockFilter = useStore((state) => state.setBlockFilter);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'user' | 'assistant' | 'system'>('all');
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

  // Explicitly type the filters array
  const filters: Array<'all' | 'user' | 'assistant' | 'system'> = ['all', 'user', 'assistant', 'system'];

  return (
    <div className='relative'>
      <button
        className='btn btn-neutral dark:new-btn dark:new-btn-neutral btn-small flex gap-1'
        type='button'
        onClick={() => setDropDown((prev) => !prev)}
      >
        {t(selectedFilter)}
        <DownChevronArrow />
      </button>
      <div
        ref={dropDownRef}
        className={`${dropDown ? '' : 'hidden'} absolute top-full mt-1 z-10 bg-white rounded-lg shadow-xl border dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:new-chat-light opacity-90`}
      >
        <ul className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0'>
          {filters.map((filter) => (
            <li
              className='px-4 py-2 hover:bg-gray-100 dark:hover:new-chat-light-hover dark:hover:text-white cursor-pointer'
              onClick={() => {
                setSelectedFilter(filter);
                // No need for type assertion here since filters is explicitly typed
                setBlockFilter(filter);
                setDropDown(false);
              }}
              key={filter}
            >
              {t(filter)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlockFilter;
