import useStore from '@store/store';

import AboutMenu from '@components/Menu/AboutMenu';
import ImportExportChat from '@components/Chat/ImportExportChat';
import SettingsMenu from '@components/Menu/SettingsMenu';
import CollapseOptions from './CollapseOptions';
import TokensCostModal from './TokensCostModal'
import AuthenticatedUserLogout from './AuthenticatedUserLogout';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

const MenuOptions = () => {
  const hideMenuOptions = useStore((state) => state.hideMenuOptions);
  const countTotalTokens = useStore((state) => state.countTotalTokens);
  return (
    <>
      {/* <CollapseOptions /> */}
      <div
        className={`${
          hideMenuOptions ? 'max-h-0' : 'max-h-full'
        } overflow-hidden transition-all`}
      >
        {countTotalTokens && <TokensCostModal />}
        <SettingsMenu />
        <AboutMenu />
        <AuthenticatedUserLogout />
      </div>
    </>
  );
};

export default MenuOptions;
