import React, { useEffect, useMemo, useState } from 'react';
import useStore from '@store/store';
import countTokens from '@utils/messageUtils';
import { defaultModel, modelCost } from '@constants/chat';

interface TokenCountProps {
  content: string;
  role: 'user' | 'assistant' | 'system';
}
const TokenCount = React.memo<TokenCountProps>(({ content, role }) => {
  const [tokenCount, setTokenCount] = useState<number>(0);
  const generating = useStore((state) => state.generating);
  const model = useStore((state) =>
    state.chats
      ? state.chats[state.currentChatIndex].config.model
      : defaultModel
  );

  const cost = useMemo(() => {
    const price =
      modelCost[model].prompt.price *
      (tokenCount / modelCost[model].prompt.unit);
    return price.toPrecision(3);
  }, [model, tokenCount]);

  useEffect(() => {
    if (!generating && content && content.length > 0) {
      setTokenCount(
        countTokens(
          [
            {
              content,
              role: role,
            },
          ],
          model
        )
      );
    } else {
      setTokenCount(0);
    }
  }, [content, generating]);

  return (
    <div className='top-[-16px] left-0'>
      <div className='text-xs italic text-gray-900 dark:text-gray-300'>
        Prompt tokens count: {tokenCount} (${cost})
      </div>
    </div>
  );
});

export default TokenCount;
