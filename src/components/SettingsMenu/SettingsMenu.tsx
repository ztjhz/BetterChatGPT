import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import useCloudAuthStore from '@store/cloud-auth-store';
import isElectron from '@utils/electron';
import PopupModal from '@components/PopupModal';
import SettingIcon from '@icon/SettingIcon';
import ThemeSwitcher from '@components/Menu/MenuOptions/ThemeSwitcher';
import LanguageSelector from '@components/LanguageSelector';
import AutoTitleToggle from './AutoTitleToggle';
import CloseToTrayToggle from './CloseToTrayToggle';
import AdvancedModeToggle from './AdvencedModeToggle';
import InlineLatexToggle from './InlineLatexToggle';

import PromptLibraryMenu from '@components/PromptLibraryMenu';
import ChatConfigMenu from '@components/ChatConfigMenu';
import EnterToSubmitToggle from './EnterToSubmitToggle';
import TotalTokenCost, { TotalTokenCostToggle } from './TotalTokenCost';
import ClearConversation from '@components/Menu/MenuOptions/ClearConversation';
import ImportExportChat from '@components/ImportExportChat/ImportExportChat';
import Api from '@components/Menu/MenuOptions/Api';


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
          <div className='px-10 py-3 mx-5 border-b border-gray-200 dark:border-gray-600 flex flex-col items-center gap-2'>
            <LanguageSelector />
            <ThemeSwitcher />
            <ImportExportChat />
            <Api />
            <ClearConversation />
            <PromptLibraryMenu />
            <ChatConfigMenu />
            <div className='pt-4 flex flex-col gap-2'>
              {isElectron() && <CloseToTrayToggle />}
              <AutoTitleToggle />
              <EnterToSubmitToggle />
              <InlineLatexToggle />
              <AdvancedModeToggle />
              <TotalTokenCostToggle />
            </div>
            <TotalTokenCost />
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default SettingsMenu;
