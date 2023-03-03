import React from 'react';
import LogoutIcon from '@icon/LogoutIcon';

const Logout = () => {
  return (
    <a className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'>
      <LogoutIcon />
      Log out
    </a>
  );
};

export default Logout;
