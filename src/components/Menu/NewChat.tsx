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
    console.log(`Model selected: ${model}`);

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
          title="New Chat - Select Model"
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
            <table className='w-full text-center'>
                <tbody>
                <tr>
                    <td style={{ textAlign: 'center', justifyContent: 'center' }}>
                        <button className='min-w-btn btn btn-neutral p-4 rounded-lg' onClick={() => handleModelSelect('gpt-3.5-turbo')}>GPT-3.5</button>
                      </td>
                    <td style={{ textAlign: 'center', justifyContent: 'center' }}>
                      <button className='min-w-btn btn btn-neutral p-4 rounded-lg' onClick={() => handleModelSelect('gpt-4')}>GPT-4</button>
                    </td>
                    <td style={{ textAlign: 'center', justifyContent: 'center' }}>
                      <button className='min-w-btn btn btn-neutral p-4 rounded-lg' onClick={() => handleModelSelect('gpt-4-turbo-preview')}>GPT-4 Turbo</button>
                    </td>
                </tr>
                <tr>
                    <td>Fast, Cheap, and reliable for general use<br/></td>
                    <td>Advanced, more nuanced; Expensive;<br/></td>
                    <td>Latest version of GPT-4; <br/>Longest context window;<br/></td>
                </tr>
                <tr>
                    <td>$0.50 / $0.15 per 1M tkn</td>
                    <td>$30.00 / $60.00 per 1M tkn</td>
                    <td>$15.00 / $30.00 per 1M tkn</td>
                </tr>
                </tbody>
            </table>
          </>
        </PopupModal>
      )}
    </>
  );
};

export default NewChat;
