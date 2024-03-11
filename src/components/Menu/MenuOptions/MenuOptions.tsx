import React from 'react';
import useStore from '@store/store';

import Api from './Api';
import Me from './Me';
import AboutMenu from '@components/AboutMenu';
import ImportExportChat from '@components/ImportExportChat';
import SettingsMenu from '@components/SettingsMenu';
import CollapseOptions from './CollapseOptions';
import GoogleSync from '@components/GoogleSync';
import TokensCostMenu from './TokensCostMenu'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

const MenuOptions = () => {
  const hideMenuOptions = useStore((state) => state.hideMenuOptions);
  const countTotalTokens = useStore((state) => state.countTotalTokens);
  return (
    <>
      <CollapseOptions />
      <div
        className={`${
          hideMenuOptions ? 'max-h-0' : 'max-h-full'
        } overflow-hidden transition-all`}
      >
        {countTotalTokens && <TokensCostMenu />}
        {/* {googleClientId && <GoogleSync clientId={googleClientId} />} */}
        <ImportExportChat />
        <SettingsMenu />
        <Api />
        {/* <Me /> */}
        <AboutMenu />
      </div>
    </>
  );
};

export default MenuOptions;
