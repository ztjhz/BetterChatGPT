import React, { useEffect, useRef } from 'react';

import useStore from '@store/store';

import NewChat from './NewChat';
import NewFolder from './NewFolder';
import ChatHistoryList from './ChatHistoryList';
import MenuOptions from './MenuOptions';
import { t } from 'i18next';
import CrossIcon2 from '@icon/CrossIcon2';
import DownArrow from '@icon/DownArrow';
import MenuIcon from '@icon/MenuIcon';
import TextColorLogo from '@logo/textColor'
import TextColorLogoDark from '@logo/textColorDark'
const Menu = () => {
  const hideSideMenu = useStore((state) => state.hideSideMenu);
  const theme = useStore((state) => state.theme);
  const setHideSideMenu = useStore((state) => state.setHideSideMenu);

  const windowWidthRef = useRef<number>(window.innerWidth);

  useEffect(() => {
    if (window.innerWidth < 768) setHideSideMenu(true);
    window.addEventListener('resize', () => {
      if (
        windowWidthRef.current !== window.innerWidth &&
        window.innerWidth < 768
      )
        setHideSideMenu(true);
    });
  }, []);

  return (
    <>
      <div
        id='menu'
        className={`group/menu h-full mb-12 dark:bg-gray-700  fixed md:inset-y-12 md:flex md:flex-col transition-transform z-[999] top-0 left-0 max-md:w-3/4 ${
          hideSideMenu ? 'md:w-[260px] translate-x-[-100%]' : 'md:w-[252px] translate-x-[0%]'
        }`}
      >
        <div className={`p-2 pt-0 rounded-md bg-white dark:bg-gray-700 h-full min-h-0 w-full ${hideSideMenu ? '' : 'ml-2'}`}>
          <div className='flex h-full min-h-0 flex-col dark:bg-gray-500 rounded-md'>
            <div className='flex h-full w-full flex-1 items-start border-white/20'>
              <nav className='flex h-full flex-1 flex-col space-y-1 px-2 pt-4 '>
                <div className='flex gap-2 text-gray-400 text-sm mb-4'>
                  {t('history')}
                </div>
                <ChatHistoryList />
              </nav>
            </div>
          </div>
        </div>
        <div
          id='menu-close'
          className={`${
            hideSideMenu ? 'hidden' : ''
          } md:hidden absolute z-[999] right-0 translate-x-full top-10 bg-gray-900 p-2 cursor-pointer hover:bg-black text-white`}
          onClick={() => {
            setHideSideMenu(true);
          }}
        >
          <CrossIcon2 />
        </div>
        <div
          className={`${
            hideSideMenu ? 'opacity-100' : 'opacity-0'
          } group/menu md:group-hover/menu:opacity-100 rounded-md max-md:hidden transition-opacity absolute z-[999] -right-2 translate-x-full -top-10 bg-violet-600 p-2 cursor-pointer hover:bg-violet-800 text-white ${
            hideSideMenu ? '' : 'rotate-90'
          }`}
          onClick={() => {
            setHideSideMenu(!hideSideMenu);
          }}
        >
          {hideSideMenu ? (
            <MenuIcon className='h-4 w-4' />
          ) : (
            <DownArrow className='h-4 w-4' />
          )}
        </div>
      </div>
      <div
        id='menu-backdrop'
        className={`${
          hideSideMenu ? 'hidden' : ''
        } md:hidden fixed top-0 left-0 h-full w-full z-[60] bg-gray-900/70`}
        onClick={() => {
          setHideSideMenu(true);
        }}
      />
    </>
  );
};

export default Menu;
