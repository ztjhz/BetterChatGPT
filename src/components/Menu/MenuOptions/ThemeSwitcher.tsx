import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import SunIcon from '@icon/SunIcon';
import MoonIcon from '@icon/MoonIcon';
import { Theme } from '@type/theme';

const getOppositeTheme = (theme: Theme): Theme => {
  if (theme === 'dark') {
    return 'light';
  } else {
    return 'dark';
  }
};
const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  const switchTheme = () => {
    setTheme(getOppositeTheme(theme!));
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return theme ? (
    <button
      className='items-center gap-3 btn btn-neutral'
      onClick={switchTheme}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      {t(getOppositeTheme(theme) + 'Mode')}
    </button>
  ) : (
    <></>
  );
};

export default ThemeSwitcher;
