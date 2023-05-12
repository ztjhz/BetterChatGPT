import React from 'react';
import useStore from '@store/store';

import Me from './Me';
import AboutMenu from '@components/AboutMenu';
import SettingsMenu from '@components/SettingsMenu';
import CollapseOptions from './CollapseOptions';
import GoogleSync from '@components/GoogleSync';
import { TotalTokenCostDisplay } from '@components/SettingsMenu/TotalTokenCost';
import isElectron from '@utils/electron';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

const MenuOptions = () => {
  const hideMenuOptions = useStore((state) => state.hideMenuOptions);
  const countTotalTokens = useStore((state) => state.countTotalTokens);
  return (
    <>
      {!isElectron() && <CollapseOptions />}
      <div
        className={`${
          hideMenuOptions ? 'max-h-0' : 'max-h-full'
        } overflow-hidden transition-all`}
      >
        {countTotalTokens && <TotalTokenCostDisplay />}
        {googleClientId && <GoogleSync clientId={googleClientId} />}
        <SettingsMenu />
        {!isElectron() && <AboutMenu />}
        {!isElectron() && <Me />}
      </div>
    </>
  );
};

export default MenuOptions;
