import React from 'react';
import useStore from '@store/store';

import ClearConversation from './ClearConversation';
import Api from './Api';
import Me from './Me';
import AboutMenu from '@components/AboutMenu';
import ImportExportChat from '@components/ImportExportChat';
import SettingsMenu from '@components/SettingsMenu';
import CollapseOptions from '@components/Menu/CollapseOptions';

const MenuOptions = () => {
  const foldMenuOptions = useStore((state) => state.foldMenuOptions);
  return (
    <>
      <CollapseOptions />
      <div
        style={{
          display: foldMenuOptions ? 'none' : '',
        }}
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
