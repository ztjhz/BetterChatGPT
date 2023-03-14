import React from 'react';

import Account from './Account';
import Api from './Api';
import Me from './Me';
import AboutMenu from '@components/AboutMenu';
import ThemeSwitcher from '@components/Menu/MenuOptions/ThemeSwitcher';
import SettingsMenu from '@components/SettingsMenu';

const MenuOptions = () => {
  return (
    <>
      <AboutMenu />
      <ThemeSwitcher />
      <Api />
      <SettingsMenu />
      <Me />
    </>
  );
};

export default MenuOptions;
