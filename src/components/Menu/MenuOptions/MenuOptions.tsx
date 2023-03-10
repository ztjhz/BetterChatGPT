import React from 'react';

import Account from './Account';
import ClearConversation from './ClearConversation';
import Api from './Api';
import Logout from './Logout';
import Me from './Me';
import ThemeSwitcher from './ThemeSwitcher';
import Updates from './Updates';
import AboutMenu from '@components/AboutMenu';
import ImportExportChat from '@components/ImportExportChat';

const MenuOptions = () => {
  return (
    <>
      <AboutMenu />
      <ClearConversation />
      <ImportExportChat />
      <Api />
      <ThemeSwitcher />
      {/* <Account /> */}
      {/* <Updates /> */}
      <Me />
      {/* <Logout /> */}
    </>
  );
};

export default MenuOptions;
