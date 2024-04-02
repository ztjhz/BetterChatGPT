// NewChat.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import PlusIcon from '@icon/PlusIcon';
import useAddChat from '@hooks/useAddChat';
import PopupModal from '@components/PopupModal'; // Ensure this is correctly imported
import { ModelOptions } from '@type/chat';
import { supportedModels } from '@constants/chat';

const NewChat = ({ folder }: { folder?: string }) => {
  const { t } = useTranslation();
  const generating = useStore((state) => state.generating);
  const [isModelSelectionOpen, setIsModelSelectionOpen] = useState(false);
  const addChat = useAddChat(); 

  const defaultModel = useStore((state) => state.defaultChatConfig.model);

  const handleModelSelect = (model: string) => {
    //console.log(`Model selected: ${model}`);

    setIsModelSelectionOpen(false); // Close the modal
  
    // Validate or cast the model string to ModelOptions
    addChat(folder, model as ModelOptions); // Cast to ModelOptions if it's valid
  };

  // Function to handle Enter key press
  const handleEnterKeyPress = (event: KeyboardEvent) => {

    //Use default model; Close ,modal;
    if (event.key === '/' && isModelSelectionOpen) {
      handleModelSelect(defaultModel);
      event.preventDefault();
    }

    //Show New Chat modal
    if (event.ctrlKey && event.key === '/' && !isModelSelectionOpen && !generating) {
      setIsModelSelectionOpen(true);
      event.preventDefault();
    }
  };

  useEffect(() => {
    // Add event listener for keydown

    if (!folder)  //Only handle for the main "New Chat" button not additional ones under Folders
      window.addEventListener('keydown', handleEnterKeyPress);

    // Cleanup function to remove event listener
    return () => {
      if (!folder)
        window.removeEventListener('keydown', handleEnterKeyPress);
    };
  }, [generating, isModelSelectionOpen, defaultModel]); // Add dependencies here


  const ModelSelectionButton = ({ model }: { model: ModelOptions }) => 
  {
    return (
    <div className='flex justify-center'>
      <button className='min-w-btn btn btn-neutral p-4 rounded-lg md:border border-gray-900 dark:border-gray-200' onClick={() => handleModelSelect(model)}>{supportedModels[model].displayName}</button>
    </div>);
  }

  const anthropicEnable:string = import.meta.env.VITE_ANTHROPIC_ENABLE || "N";
  // console.log(`Anthropic Enable: ${anthropicEnable}`)

  return (
    <>
      <a
        className={`flex flex-1 items-center rounded-md hover:bg-gray-500/10 transition-all duration-200 text-white text-sm flex-shrink-0 ${
          generating ? 'cursor-not-allowed opacity-40' : 'cursor-pointer opacity-100'
        } ${folder ? 'justify-start' : 'py-2 px-2 gap-3 mb-2 border border-white/20'}`}
        onClick={() => {
          if (!generating) setIsModelSelectionOpen(true);
        }}
        title={folder ? String(t('newChat')) : 'Hotkey: Ctrl + /'}
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
          title="New Chat: Select Model. Press / for default."
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
            <table className='w-full text-center text-gray-700 dark:text-gray-300' style={{ tableLayout: 'fixed' }}>
                <tbody>
                <tr><td className='pt-2 text-lg' colSpan={3}><b>OpenAI GPT: Iconic Large Language Models that started it all</b></td></tr>
                <tr>
                    <td style={{ paddingTop: '20px' }}>
                      <ModelSelectionButton model='gpt-3.5-turbo'/>
                    </td>
                    <td style={{ paddingTop: '20px' }}>
                      GPT-4 (non-Turbo)
                    </td>
                    <td style={{ paddingTop: '20px' }}>
                      <ModelSelectionButton model='gpt-4-turbo-preview'/>
                    </td>                    
                </tr>
                <tr style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                    <td style={{ paddingTop: '10px' }}>Same as "free" ChatGPT.com<br/>Obsolete. Try Haiku instead.</td>
                    <td style={{ paddingTop: '10px' }}>GPT-4 (non-Turbo) is obsolete. Try Anthropic Claude instead.</td>
                    <td style={{ paddingTop: '10px' }}>OpenAI's strongest model <br/>Context up to 128K tokens</td>
                </tr>
                <tr style={{ paddingTop: '20px', paddingBottom: '20px', verticalAlign: 'top'}}>
                    <td style={{ paddingTop: '10px' }}>Cheap <b>(baseline)</b><br/>per input/output token</td>
                    <td style={{ paddingTop: '10px' }}>Price-performance is no longer competitive with other options</td>
                    <td style={{ paddingTop: '10px' }}>Cost: <b>20x</b> of GPT-3.5<br/>per input/output token</td>
                </tr>
                <tr><td className='pt-6 text-lg' colSpan={3}></td></tr>
                {(anthropicEnable=='Y') && (
                  <>
                    <tr><td className='pt-2 text-lg border-t' colSpan={3}><b>Anthropic Claude 3: newest models by Anthropic, a strong OpenAI rival</b></td></tr>
                    <tr><td className='' colSpan={3}>See <a className={`text-indigo-700 hover:text-indigo-500 visited:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:visited:text-indigo-400`} 
                        href="https://www.anthropic.com/news/claude-3-family">https://www.anthropic.com/news/claude-3-family</a></td></tr>
                    <tr>
                        <td style={{ paddingTop: '20px' }}>
                          <ModelSelectionButton model='claude-3-haiku'/>
                        </td>
                        <td style={{ paddingTop: '20px' }}>
                          <ModelSelectionButton model='claude-3-sonnet'/>
                        </td>
                        <td style={{ paddingTop: '20px' }}>
                          <ModelSelectionButton model='claude-3-opus'/>
                        </td>  
                    </tr>
                    <tr style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                        <td style={{ paddingTop: '10px' }}>Anthropic's fast&cheap model<br/>Approaches GPT-4<br/>Context up to 200K tokens</td>
                        <td style={{ paddingTop: '10px' }}>Very strong mid-range model<br/>Comparable with GPT-4<br/>Context up to 200K tokens</td>
                        <td style={{ paddingTop: '10px' }}>Anthropic's strongest model <br/>Beats most GPT-4 benchmarks<br/>Context up to 200K tokens</td>
                    </tr>
                    <tr style={{ paddingTop: '20px', paddingBottom: '20px', verticalAlign: 'top'}}>
                        <td style={{ paddingTop: '10px' }}>Cost: <b>60-80%</b> of GPT-3.5<br/><b>(cheaper but better!)</b></td>
                        <td style={{ paddingTop: '10px' }}>Cost: <b>~8x</b> of GPT-3.5<br/>per input/output token</td>
                        <td style={{ paddingTop: '10px' }}>Cost: <b>~50x</b> of GPT-3.5<br/>per input/output token</td>
                    </tr>
                  </>
                )}
                </tbody>
            </table>
            
          </>
        </PopupModal>
      )}
    </>
  );
};

export default NewChat;
