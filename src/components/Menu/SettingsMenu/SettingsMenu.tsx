import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import useCloudAuthStore from '@store/cloud-auth-store';

import PopupModal from '@components/PopupModal';
import SettingIcon from '@icon/SettingIcon';
import ThemeSwitcher from '@components/Menu/SettingsMenu/ThemeSwitcher';
import LanguageSelector from '@components/Menu/SettingsMenu/LanguageSelector';
import AutoTitleToggle from './AutoTitleToggle';
import AdvancedModeToggle from './AdvencedModeToggle';
import InlineLatexToggle from './InlineLatexToggle';
import EnterToSubmitToggle from './EnterToSubmitToggle';
import RequestTokensCountToggle from './RequestTokensCountToggle'
import { TotalTokenCostToggle } from '../TokensTotalCost';
import ChatNamesAsPageTitlesToggle from './ChatNamesAsPageTitlesToggle';
import PromptLibraryMenu from '@components/Menu/SettingsMenu/PromptLibraryMenu';
import ChatConfigMenu from '@components/Menu/SettingsMenu/DefaultChatConfigMenu';
import ApiButton from './ApiButton';
import ClearConversation from '@components/Menu/SettingsMenu/ClearConversation';
import ImportExportChat from '@components/Chat/ImportExportChat';
import { _defaultChatConfig, _defaultSystemMessage } from '@constants/chat';



const SettingsMenu = () => {
  const { t } = useTranslation();

  const theme = useStore.getState().theme;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  return (
    <>
      <a
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <SettingIcon className='w-4 h-4' /> {t('setting') as string}
      </a>
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('setting') as string}
          cancelButton={false}
        >
          <div className='p-6 border-b border-gray-200 dark:border-gray-600 flex-col items-start gap-4 w-96'>
            <LanguageSelector />
            <div className='p-1'><></></div>
            <DefaultSystemChat />
            <div className='p-1'><></></div>
              <div className='flex flex-col gap-3'>
              <AutoTitleToggle />
              <ChatNamesAsPageTitlesToggle/>
              <EnterToSubmitToggle />
              <TotalTokenCostToggle />
              <RequestTokensCountToggle />
              {/* <InlineLatexToggle /> */}
              <AdvancedModeToggle />
            </div>
            <div className='p-1 mt-4'><ThemeSwitcher /></div>
            <div className='p-1'><PromptLibraryMenu /></div>
            <div className='p-1'><ChatConfigMenu /></div>
            <div className='p-1'><ApiButton /></div>
            <div className='p-1'><ImportExportChat /></div>
            <div className='p-1'><ClearConversation /></div>
          </div>
        </PopupModal>
      )}
    </>
  );
};


const DefaultSystemChat = () => {
  const { t } = useTranslation('model');

  const setDefaultSystemMessage = useStore(state => state.setDefaultSystemMessage);

  const [_systemMessage, _setSystemMessage] = useState<string>(useStore.getState().defaultSystemMessage);


  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = `32`;
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.maxHeight = '2.5rem';
  };

  return (
    <div>
      <div className='block text-sm font-medium text-gray-900 dark:text-white'>
        {t('defaultSystemMessage')}
      </div>
      <textarea
        // overflow-y-hidden
        className='w-full my-2 mx-0 px-2 resize-none rounded-lg bg-transparent resize-none leading-7 p-1 border border-gray-400/50 focus:ring-1 focus:ring-blue max-h-8 transition-all text-gray-900 dark:text-gray-300'
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={(e) => {
          _setSystemMessage(e.target.value);       // Local state for display
          setDefaultSystemMessage(e.target.value); // Update the store
        }}
        onInput={handleInput}
        value={_systemMessage}
        rows={8}
      ></textarea>
    </div>
  );
};

export default SettingsMenu;
