import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import { matchSorter } from 'match-sorter';
import { Prompt } from '@type/prompt';

const CommandPrompt = ({
  _setContent,
}: {
  _setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const prompts = useStore((state) => state.prompts);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [_prompts, _setPrompts] = useState<Prompt[]>(prompts);
  const [input, setInput] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filteredPrompts = matchSorter(useStore.getState().prompts, input, {
      keys: ['name'],
    });
    _setPrompts(filteredPrompts);
  }, [input]);

  useEffect(() => {
    _setPrompts(prompts);
    setInput('');
  }, [prompts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropDown(false);
      }
    };

    if (dropDown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, dropDown]);

  return (
    <div className='relative max-wd-sm' ref={dropdownRef}>
      <button
        className='btn btn-neutral btn-small'
        onClick={() => setDropDown(!dropDown)}
      >
        /
      </button>
      <div
        className={`${
          dropDown ? '' : 'hidden'
        } absolute top-100 bottom-100 right-0 z-10 bg-white rounded-lg shadow-xl border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800 opacity-90`}
      >
        <div className='text-sm px-4 py-2 w-max'>{t('promptLibrary')}</div>
        <input
          type='text'
          className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 m-0 w-full mr-0 h-8 focus:outline-none'
          value={input}
          placeholder={t('search') as string}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <ul className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0 w-max max-w-sm max-md:max-w-[90vw] max-h-32 overflow-auto'>
          {_prompts.map((cp) => (
            <li
              className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer text-start w-full'
              onClick={() => {
                _setContent((prev) => prev + cp.prompt);
                setDropDown(false);
              }}
              key={cp.id}
            >
              {cp.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommandPrompt;
