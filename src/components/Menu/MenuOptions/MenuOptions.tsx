import AboutMenu from '@components/AboutMenu';
import ImportExportChat from '@components/ImportExportChat';
import CollapseOptions from '@components/Menu/CollapseOptions';
import SettingsMenu from '@components/SettingsMenu';
import useStore from '@store/store';
import React from 'react';
import Api from './Api';
import ClearConversation from './ClearConversation';
import Me from './Me';

const MenuOptions = () => {
  const foldMenuOptions = useStore((state) => state.foldMenuOptions);
  return (
    <>
      <CollapseOptions />
      <div style={ {
        display: foldMenuOptions ? 'none' : '',
      } }>
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
