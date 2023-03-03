import React from 'react';

import Account from './Account';
import ClearConversation from './ClearConversation';
import Config from './Config';
import Logout from './Logout';
import Me from './Me';
import ThemeSwitcher from './ThemeSwitcher';
import Updates from './Updates';

const MenuOptions = () => {
  return (
    <>
      {/* <ClearConversation /> */}
      <Config />
      <ThemeSwitcher />
      {/* <Account /> */}
      <Updates />
      <Me />
      {/* <Logout /> */}
    </>
  );
};

export default MenuOptions;
