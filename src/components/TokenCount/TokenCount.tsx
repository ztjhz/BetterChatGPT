import React, { useMemo } from 'react';
import useStore from '@store/store';

import { modelCost } from '@constants/chat';

const TokenCount = React.memo(({ tokenCount }: { tokenCount: number }) => {
  const model = useStore((state) =>
    state.chats
      ? state.chats[state.currentChatIndex].config.model
      : 'gpt-3.5-turbo'
  );

  const cost = useMemo(() => {
    const price =
      modelCost[model].prompt.price *
      (tokenCount / modelCost[model].prompt.unit);
    return price.toPrecision(3);
  }, [model, tokenCount]);

  return tokenCount ? (
    <div className='absolute top-[-16px] right-0'>
      <div className='text-xs italic text-gray-900 dark:text-gray-300'>
        Tokens: {tokenCount} (${cost})
      </div>
    </div>
  ) : (
    <></>
  );
});

export default TokenCount;
