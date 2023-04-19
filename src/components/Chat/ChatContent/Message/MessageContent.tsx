import React, { useState } from 'react';
import useStore from '@store/store';

import ContentView from './View/ContentView';
import EditView from './View/EditView';

const MessageContent = ({
  role,
  content,
  messageIndex,
  tokenCount,
  preserve,
  inContext,
  sticky = false,
}: {
  role: string;
  content: string;
  messageIndex: number;
  tokenCount: number;
  inContext: boolean;
  preserve: boolean;
  sticky: boolean;
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(sticky);
  const advancedMode = useStore((state) => state.advancedMode);

  return (
    <div className='relative flex flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]'>
      {advancedMode && <div className='flex flex-grow flex-col gap-3'></div>}
      {isEdit ? (
        <EditView
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
          tokenCount={tokenCount}
          preserve={preserve}
          sticky={sticky}
        />
      ) : (
        <ContentView
          role={role}
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
          // tokenCount={tokenCount}
          inContext={inContext}
          preserve={preserve}
        />
      )}
    </div>
  );
};

export default MessageContent;
