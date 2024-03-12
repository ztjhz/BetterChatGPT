import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import Toggle from '@components/Toggle';

const ChatNamesAsPageTitlesToggle = () => {
  const { t } = useTranslation();

  const setChatNamesAsPageTitles = useStore((state) => state.setChatNamesAsPageTitles);

  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().chatNamesAsPageTitles
  );

  useEffect(() => {
    setChatNamesAsPageTitles(isChecked);
  }, [isChecked]);

  return (
    <Toggle
      label={t('chatNamesAsPageTitles') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default ChatNamesAsPageTitlesToggle;
