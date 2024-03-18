// NewChat.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import PlusIcon from '@icon/PlusIcon';
import useAddChat from '@hooks/useAddChat';
import PopupModal from '@components/PopupModal'; // Ensure this is correctly imported
import { ModelOptions } from '@type/chat';
import { min } from 'lodash';

const NewChat = ({ folder }: { folder?: string }) => {
  const { t } = useTranslation();
  const generating = useStore((state) => state.generating);
  const [isModelSelectionOpen, setIsModelSelectionOpen] = useState(false);
  const addChat = useAddChat(); 

  const handleModelSelect = (model: string) => {
    //console.log(`Model selected: ${model}`);

    setIsModelSelectionOpen(false); // Close the modal
  
    // Validate or cast the model string to ModelOptions
    addChat(folder, model as ModelOptions); // Cast to ModelOptions if it's valid
  };

  return (
    <>
      <a
        className={`flex flex-1 items-center rounded-md hover:bg-gray-500/10 transition-all duration-200 text-white text-sm flex-shrink-0 ${
          generating ? 'cursor-not-allowed opacity-40' : 'cursor-pointer opacity-100'
        } ${folder ? 'justify-start' : 'py-2 px-2 gap-3 mb-2 border border-white/20'}`}
        onClick={() => {
          if (!generating) setIsModelSelectionOpen(true);
        }}
        title={folder ? String(t('newChat')) : ''}
      >
        {folder ? (
          <div className='max-h-0 parent-sibling-hover:max-h-10 hover:max-h-10 parent-sibling-hover:py-2 hover:py-2 px-2 overflow-hidden transition-all duration-200 delay-500 text-sm flex gap-3 items-center text-gray-100'>
            <PlusIcon /> {t('newChat')}
          </div>
        ) : (
          <>
            <PlusIcon />
            <span className='inline-flex text-white text-sm'>{t('newChat')}</span>
          </>
        )}
      </a>
      {isModelSelectionOpen && (
        <PopupModal
          title="New Chat: Select Model"
          setIsModalOpen={setIsModelSelectionOpen}
          cancelButton={true}
        >
          <>
            <style>
            {`
                .min-w-btn {
                    min-width: 160px; /* Adjust this value based on your needs */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            `}
            </style>
            <div className='grid grid-cols-3 gap-4'>
              <div className='text-center text-gray-700 dark:text-gray-300'>
                <button className='min-w-btn btn btn-neutral p-4 rounded-lg mb-4' onClick={() => handleModelSelect('gpt-3.5-turbo')}>GPT-3.5</button>
                <p>Reliable for general use<br/>16K tokens context</p>
                <p>Cost: Very Cheap<br/>(baseline)</p>
              </div>
              <div className='text-center text-gray-700 dark:text-gray-300'>
                <button className='min-w-btn btn btn-neutral p-4 rounded-lg mb-4' onClick={() => handleModelSelect('gpt-4')}>GPT-4</button>
                <p>Advanced, more nuanced<br/>8K tokens context</p>
                <p>Cost: <b>120x</b> of GPT-3.5<br/>per input/output token</p>
              </div>
              <div className='text-center text-gray-700 dark:text-gray-300'>
                <button className='min-w-btn btn btn-neutral p-4 rounded-lg mb-4' onClick={() => handleModelSelect('gpt-4-turbo-preview')}>GPT-4 Turbo</button>
                <p>Latest version of GPT-4 <br/>up to 128K tokens context</p>
                <p>Cost: <b>60x</b> of GPT-3.5<br/>per input/output token</p>
              </div>
              <div className='text-center text-gray-700 dark:text-gray-300'>
                <button className='min-w-btn btn btn-neutral p-4 rounded-lg mb-4' onClick={() => handleModelSelect('claude-3-haiku')}>Claude-3 Haiku</button>
                <p>Specialized in poetic responses</p>
                <p>Cost: Comparable to GPT-3.5</p>
              </div>
              <div className='text-center text-gray-700 dark:text-gray-300'>
                <button className='min-w-btn btn btn-neutral p-4 rounded-lg mb-4' onClick={() => handleModelSelect('claude-3-sonnet')}>Claude-3 Sonnet</button>
                <p>Generates sonnets with ease</p>
                <p>Cost: Slightly higher than GPT-3.5</p>
              </div>
              <div className='text-center text-gray-700 dark:text-gray-300'>
                <button className='min-w-btn btn btn-neutral p-4 rounded-lg mb-4' onClick={() => handleModelSelect('claude-3-opus')}>Claude-3 Opus</button>
                <p>Best for long-form content</p>
                <p>Cost: more then GPT-4 Turbo</p>
              </div>
            </div>

          </>
        </PopupModal>
      )}
    </>
  );
};

export default NewChat;
