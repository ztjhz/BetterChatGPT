import React, { useState } from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';

import PopupModal from '@components/PopupModal';
import {
  FrequencyPenaltySlider,
  MaxTokenSlider,
  ModelSelector,
  PresencePenaltySlider,
  TemperatureSlider,
  TopPSlider,
} from '@components/Chat/ChatConfigMenu/ChatConfigMenu';

import { ModelOptions } from '@type/chat';
import { _defaultChatConfig } from '@constants/chat';
import LinkIcon from '@icon/LinkIcon'

const DefaultChatConfigMenu = () => {
  const { t } = useTranslation('model');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div>
      <button
        className='items-center gap-3 btn btn-neutral'
        onClick={() => setIsModalOpen(true)}
        aria-label={t('defaultChatConfig') as string}
      >
        <LinkIcon />
        {t('defaultChatConfig')}
      </button>
      {isModalOpen && <ChatConfigPopup setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

const ChatConfigPopup = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const config = useStore.getState().defaultChatConfig;
  const setDefaultChatConfig = useStore((state) => state.setDefaultChatConfig);

  const [_model, _setModel] = useState<ModelOptions>(config.model);
  const [_maxPromptTokens, _setMaxPromptToken] = useState<number>(config.maxPromptTokens);
  const [_maxGenerationTokens, _setMaxGenerationToken] = useState<number>(config.maxGenerationTokens);
  const [_temperature, _setTemperature] = useState<number>(config.temperature);
  const [_topP, _setTopP] = useState<number>(config.top_p);
  const [_presencePenalty, _setPresencePenalty] = useState<number>(
    config.presence_penalty
  );
  const [_frequencyPenalty, _setFrequencyPenalty] = useState<number>(
    config.frequency_penalty
  );

  const { t } = useTranslation('model');

  const handleSave = () => {
    setDefaultChatConfig({
      model: _model,
      maxPromptTokens: _maxPromptTokens,
      maxGenerationTokens: _maxGenerationTokens,
      temperature: _temperature,
      top_p: _topP,
      presence_penalty: _presencePenalty,
      frequency_penalty: _frequencyPenalty,
    });
    setIsModalOpen(false);
  };

  const handleReset = () => {
    _setModel(_defaultChatConfig.model);
    _setMaxPromptToken(_defaultChatConfig.maxGenerationTokens);
    _setMaxGenerationToken(_defaultChatConfig.maxPromptTokens);
    _setTemperature(_defaultChatConfig.temperature);
    _setTopP(_defaultChatConfig.top_p);
    _setPresencePenalty(_defaultChatConfig.presence_penalty);
    _setFrequencyPenalty(_defaultChatConfig.frequency_penalty);
  };

  return (
    <PopupModal
      title={t('defaultChatConfig') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600 w-[90vw] max-w-full text-sm text-gray-900 dark:text-gray-300'>
        <ModelSelector _model={_model} _setModel={_setModel} />
        <MaxTokenSlider
          _maxToken={_maxPromptTokens}
          _setMaxToken={_setMaxPromptToken}
          _model={_model}
          _translationItem='maxPromptTokens'
        />
        <MaxTokenSlider
          _maxToken={_maxGenerationTokens}
          _setMaxToken={_setMaxGenerationToken}
          _model={_model}
          _translationItem='maxGenerationTokens'
        />
        <TemperatureSlider
          _temperature={_temperature}
          _setTemperature={_setTemperature}
        />
        <TopPSlider _topP={_topP} _setTopP={_setTopP} />
        <PresencePenaltySlider
          _presencePenalty={_presencePenalty}
          _setPresencePenalty={_setPresencePenalty}
        />
        <FrequencyPenaltySlider
          _frequencyPenalty={_frequencyPenalty}
          _setFrequencyPenalty={_setFrequencyPenalty}
        />
        <div
          className='btn btn-neutral cursor-pointer mt-5'
          onClick={handleReset}
        >
          {t('resetToDefault')}
        </div>
      </div>
    </PopupModal>
  );
};

export default DefaultChatConfigMenu;
