import React from 'react';

import Account from './Account';
import Api from './Api';
import Me from './Me';
import AboutMenu from '@components/AboutMenu';
import SettingsMenu from '@components/SettingsMenu';

const MenuOptions = () => {
  return (
    <>
      <AboutMenu />
      <Api />
      <SettingsMenu />
      <Me />
    </>
  );
};

export default MenuOptions;
