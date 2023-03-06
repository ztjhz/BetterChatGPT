import React, { useState } from 'react';
import PopupModal from '@components/PopupModal';
import { ConfigInterface } from '@type/chat';

const ConfigMenu = ({
  setIsModalOpen,
  config,
  setConfig,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  config: ConfigInterface;
  setConfig: (config: ConfigInterface) => void;
}) => {
  const [_temperature, _setTemperature] = useState<number>(config.temperature);
  const [_presencePenalty, _setPresencePenalty] = useState<number>(
    config.presence_penalty
  );

  const handleConfirm = () => {
    setConfig({
      temperature: _temperature,
      presence_penalty: _presencePenalty,
    });
    setIsModalOpen(false);
  };

  return (
    <PopupModal
      title='Configuration'
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleConfirm}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
        <div>
          <label className='block text-sm font-medium text-gray-900 dark:text-white'>
            Temperature: {_temperature}
          </label>
          <input
            id='default-range'
            type='range'
            value={_temperature}
            onChange={(e) => {
              _setTemperature(Number(e.target.value));
            }}
            min={0}
            max={2}
            step={0.1}
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
          />
          <div className='min-w-fit text-gray-500 dark:text-gray-300 text-sm mt-2'>
            What sampling temperature to use, between 0 and 2. Higher values
            like 0.8 will make the output more random, while lower values like
            0.2 will make it more focused and deterministic.
          </div>
        </div>
        <div className='mt-5 pt-5 border-t border-gray-500'>
          <label className='block text-sm font-medium text-gray-900 dark:text-white'>
            Presence Penalty: {_presencePenalty}
          </label>
          <input
            id='default-range'
            type='range'
            value={_presencePenalty}
            onChange={(e) => {
              _setPresencePenalty(Number(e.target.value));
            }}
            min={-2}
            max={2}
            step={0.1}
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
          />
          <div className='min-w-fit text-gray-500 dark:text-gray-300 text-sm mt-2'>
            Number between -2.0 and 2.0. Positive values penalize new tokens
            based on whether they appear in the text so far, increasing the
            model's likelihood to talk about new topics.
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default ConfigMenu;
