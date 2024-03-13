import React, { useState } from 'react';

import TickIcon from '@icon/TickIcon';
import CopyIcon from '@icon/CopyIcon';

import BaseButton from './BaseButton';

const CopyButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  return (
    <BaseButton
      icon={isCopied ? <TickIcon /> : <CopyIcon />}
      buttonProps={{ 'aria-label': 'copy message' }}
      onClick={(e) => {
        onClick(e);
        setIsCopied(true);
        window.setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      }}
    />
  );
};

export default CopyButton;
