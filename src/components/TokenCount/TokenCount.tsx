import React, { useEffect, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';

import { countMessagesToken } from '@utils/messageUtils';

const TokenCount = React.memo(() => {
  const [tokenCount, setTokenCount] = useState<number>(0);
  const generating = useStore((state) => state.generating);
  const messages = useStore(
    (state) =>
      state.chats ? state.chats[state.currentChatIndex].messages : [],
    shallow
  );

  useEffect(() => {
    if (!generating) setTokenCount(countMessagesToken(messages));
  }, [messages, generating]);

  return (
    <div className='absolute top-[-16px] right-0'>
      <div className='text-xs italic text-gray-900 dark:text-gray-300'>
        Tokens: {tokenCount}
      </div>
    </div>
  );
});

export default TokenCount;
