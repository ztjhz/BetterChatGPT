import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import Toggle from '@components/Toggle';

const CloseToTrayToggle = () => {
  const { t } = useTranslation();

  const setCloseToTray = useStore((state) => state.setCloseToTray);

  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().closeToTray
  );

  useEffect(() => {
    setCloseToTray(isChecked);
  }, [isChecked]);

  return (
    <Toggle
      label={t('closeToTray') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default CloseToTrayToggle;
