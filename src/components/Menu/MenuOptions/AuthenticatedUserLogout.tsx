import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import useStore from '@store/store';

import LogoutIcon from '@icon/LogoutIcon';

import Cookies from 'js-cookie';

const handleSignOut = async () => {   
    await Cookies.remove('AppServiceAuthSession');
    await Cookies.remove('AppServiceAuthSession1');
    await Cookies.remove('StaticWebAppsAuthCookie');
    
    window.location.reload();
  };

const AuthenticatedUserLogout = () => {

  const { t } = useTranslation();
  
  const userName = useStore((state) => state.userName);

  return (
    <>
      <a
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        id='api-menu'
        onClick={() => handleSignOut()}
      >
       <LogoutIcon />
        {t('logout')} ({userName})
      </a>
    </>
  );
};

export default AuthenticatedUserLogout;
