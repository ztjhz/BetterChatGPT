import React from 'react';
import useStore from '@store/store';

import ClearConversation from './ClearConversation';
import Api from './Api';
import Me from './Me';
import AboutMenu from '@components/AboutMenu';
import ImportExportChat from '@components/ImportExportChat';
import SettingsMenu from '@components/SettingsMenu';
import CollapseOptions from './CollapseOptions';

const MenuOptions = () => {
  const hideMenuOptions = useStore((state) => state.hideMenuOptions);
  return (
    <>
      <CollapseOptions />
      <div
        className={`${
          hideMenuOptions ? 'max-h-0' : 'max-h-full'
        } overflow-hidden transition-all`}
      >
        <AboutMenu />
        <ClearConversation />
        <ImportExportChat />
        <Api />
        <SettingsMenu />
        <Me />
      </div>
    </>
  );
};

export default MenuOptions;
