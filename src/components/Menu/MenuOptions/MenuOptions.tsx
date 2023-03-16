import AboutMenu from '@components/AboutMenu';
import ImportExportChat from '@components/ImportExportChat';
import CollapseOptions from '@components/Menu/CollapseOptions';
import SettingsMenu from '@components/SettingsMenu';
import React, { useState } from 'react';
import Api from './Api';
import ClearConversation from './ClearConversation';
import Me from './Me';

const MenuOptions = () => {
  const [ fold, setFold ] = useState<boolean>(false);
  return (
    <>
      <CollapseOptions onSetFold={ setFold } fold={ fold } />
      {
        fold || (
          <>
            <AboutMenu />
            <ClearConversation />
            <ImportExportChat />
            <Api />
            <SettingsMenu />
            <Me />
          </>
        )
      }
    </>
  );
};

export default MenuOptions;
