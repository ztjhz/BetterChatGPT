import React from 'react';

import Account from './Account';
import ClearConversation from './ClearConversation';
import Api from './Api';
import Me from './Me';
import AboutMenu from '@components/AboutMenu';
import ImportExportChat from '@components/ImportExportChat';
import SettingsMenu from '@components/SettingsMenu';

const MenuOptions = () => {
  return (
    <>
      <AboutMenu />
      <ClearConversation />
      <ImportExportChat />
      <Api />
      <SettingsMenu />
      <Me />
    </>
  );
};

export default MenuOptions;
