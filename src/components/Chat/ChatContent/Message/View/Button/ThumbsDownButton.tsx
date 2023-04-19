import React from 'react';

import ThumbsDown from '@icon/ThumbsDown';

import BaseButton from './BaseButton';

const ThumbsDownButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <BaseButton
      icon={<ThumbsDown />}
      onClick={onClick}
    />
  );
};

export default ThumbsDownButton;