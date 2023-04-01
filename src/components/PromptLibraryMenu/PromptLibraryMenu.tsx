import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';

import PopupModal from '@components/PopupModal';
import { Prompt } from '@type/prompt';
import PlusIcon from '@icon/PlusIcon';
import CrossIcon from '@icon/CrossIcon';
import { v4 as uuidv4 } from 'uuid';
import ImportPrompt from './ImportPrompt';
import ExportPrompt from './ExportPrompt';

const PromptLibraryMenu = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div>
      <button className='btn btn-neutral' onClick={() => setIsModalOpen(true)}>
        {t('promptLibrary')}
      </button>
      {isModalOpen && (
        <PromptLibraryMenuPopUp setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
};

const PromptLibraryMenuPopUp = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();

  const setPrompts = useStore((state) => state.setPrompts);
  const prompts = useStore((state) => state.prompts);

  const [_prompts, _setPrompts] = useState<Prompt[]>(
    JSON.parse(JSON.stringify(prompts))
  );
  const container = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  const handleSave = () => {
    setPrompts(_prompts);
    setIsModalOpen(false);
  };

  const addPrompt = () => {
    const updatedPrompts: Prompt[] = JSON.parse(JSON.stringify(_prompts));
    updatedPrompts.push({
      id: uuidv4(),
      name: '',
      prompt: '',
    });
    _setPrompts(updatedPrompts);
  };

  const deletePrompt = (index: number) => {
    const updatedPrompts: Prompt[] = JSON.parse(JSON.stringify(_prompts));
    updatedPrompts.splice(index, 1);
    _setPrompts(updatedPrompts);
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.maxHeight = '2.5rem';
  };

  useEffect(() => {
    _setPrompts(prompts);
  }, [prompts]);

  return (
    <PopupModal
      title={t('promptLibrary') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600 w-[90vw] max-w-full text-sm text-gray-900 dark:text-gray-300'>
        <div className='border px-4 py-2 rounded border-gray-200 dark:border-gray-600'>
          <ImportPrompt />
          <ExportPrompt />
        </div>
        <div className='flex flex-col p-2 max-w-full' ref={container}>
          <div className='flex font-bold border-b border-gray-500/50 mb-1 p-1'>
            <div className='sm:w-1/4 max-sm:flex-1'>{t('name')}</div>
            <div className='flex-1'>{t('prompt')}</div>
          </div>
          {_prompts.map((prompt, index) => (
            <div
              key={prompt.id}
              className='flex items-center border-b border-gray-500/50 mb-1 p-1'
            >
              <div className='sm:w-1/4 max-sm:flex-1'>
                <textarea
                  className='m-0 resize-none rounded-lg bg-transparent overflow-y-hidden leading-7 p-1 focus:ring-1 focus:ring-blue w-full max-h-10 transition-all'
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                  onChange={(e) => {
                    _setPrompts((prev) => {
                      const newPrompts = [...prev];
                      newPrompts[index].name = e.target.value;
                      return newPrompts;
                    });
                  }}
                  onInput={handleInput}
                  value={prompt.name}
                  rows={1}
                ></textarea>
              </div>
              <div className='flex-1'>
                <textarea
                  className='m-0 resize-none rounded-lg bg-transparent overflow-y-hidden leading-7 p-1 focus:ring-1 focus:ring-blue w-full max-h-10 transition-all'
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                  onChange={(e) => {
                    _setPrompts((prev) => {
                      const newPrompts = [...prev];
                      newPrompts[index].prompt = e.target.value;
                      return newPrompts;
                    });
                  }}
                  onInput={handleInput}
                  value={prompt.prompt}
                  rows={1}
                ></textarea>
              </div>
              <div
                className='cursor-pointer'
                onClick={() => deletePrompt(index)}
              >
                <CrossIcon />
              </div>
            </div>
          ))}
        </div>
        <div className='flex justify-center cursor-pointer' onClick={addPrompt}>
          <PlusIcon />
        </div>
        <div className='mt-6 px-2'>
          {t('morePrompts')}
          <a
            href='https://github.com/f/awesome-chatgpt-prompts'
            target='_blank'
            className='link'
          >
            awesome-chatgpt-prompts
          </a>
        </div>
      </div>
    </PopupModal>
  );
};

export default PromptLibraryMenu;
