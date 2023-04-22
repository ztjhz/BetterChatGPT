import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import Toggle from '@components/Toggle';

const AdvancedModeToggle = () => {
  const { t } = useTranslation();

  const setAdvancedMode = useStore((state) => state.setAdvancedMode);

  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().advancedMode
  );

  useEffect(() => {
    setAdvancedMode(isChecked);
  }, [isChecked]);

  return (
    <Toggle
      label={t('advancedMode') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default AdvancedModeToggle;
