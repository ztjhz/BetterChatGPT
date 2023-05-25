import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import Toggle from '@components/Toggle';

const ShareGPTToggle = () => {
  const { t } = useTranslation();

  const setShareGPT = useStore((state) => state.setShareGPT);

  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().shareGPT
  );

  useEffect(() => {
    setShareGPT(isChecked);
  }, [isChecked]);

  return (
    <Toggle
      label={t('postOnShareGPT.title') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default ShareGPTToggle;
