import React, { useEffect, useState } from 'react';
import SunIcon from '@icon/SunIcon';
import MoonIcon from '@icon/MoonIcon';

type Theme = 'light' | 'dark';

const getOppositeTheme = (theme: Theme): Theme => {
  if (theme === 'dark') {
    return 'light';
  } else {
    return 'dark';
  }
};
const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>();

  const switchTheme = () => {
    setTheme(getOppositeTheme(theme!));
  };

  useEffect(() => {
    const _theme = localStorage.getItem('theme');
    if (_theme === 'light' || _theme === 'dark') {
      setTheme(_theme);
    } else {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.className = theme;
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    theme && (
      <a
        className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={switchTheme}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        {getOppositeTheme(theme).charAt(0).toUpperCase() +
          getOppositeTheme(theme).slice(1)}{' '}
        mode
      </a>
    )
  );
};

export default ThemeSwitcher;
