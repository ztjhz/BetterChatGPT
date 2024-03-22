import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import Toggle from '@components/Toggle';

const PromptSuggestionsToggle = () => {
  const { t } = useTranslation();

  const setPromptSuggestions = useStore((state) => state.setPromptSuggestions);

  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().promptSuggestions
  );

  useEffect(() => {
    setPromptSuggestions(isChecked);
  }, [isChecked]);

  return (
    <Toggle
      label={t('promptSuggestions') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default PromptSuggestionsToggle;
