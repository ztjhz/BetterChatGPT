import React, { useEffect, useMemo, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';

import countTokens from '@utils/messageUtils';
import { supportedModels } from '@constants/chat';

const TokenCount = React.memo(() => {
  const [tokenCount, setTokenCount] = useState<number>(0);
  const generating = useStore((state) => state.generating);
  const messages = useStore(
    (state) =>
      state.chats ? state.chats[state.currentChatIndex].messages : [],
    shallow
  );

  const model = useStore((state) =>
    state.chats
      ? state.chats[state.currentChatIndex].config.model
      : 'gpt-4-turbo-preview' // it should never come to this default
  );

  const modelDetails = supportedModels[model];

  if (!modelDetails) {
    throw new Error(`Model details not found for: {$model}`);
  }

  const promptCost = (modelDetails.cost.prompt.price * (tokenCount / modelDetails.cost.prompt.unit))
        .toPrecision(3);

  useEffect(() => {
    if (!generating) setTokenCount(countTokens(messages, model));
  }, [messages, generating]);

  return (
    <div className='absolute top-[-16px] right-0'>
      <div className='text-xs italic text-gray-900 dark:text-gray-300'>
        Tokens: {tokenCount} (${promptCost})
      </div>
    </div>
  );
});

export default TokenCount;
