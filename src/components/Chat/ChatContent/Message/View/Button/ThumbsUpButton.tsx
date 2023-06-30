import React from 'react';

import ThumbsUp from '@icon/ThumbsUp';

import BaseButton from './BaseButton';

const ThumbsUpButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <BaseButton
      icon={<ThumbsUp />}
      onClick={onClick}
    />
  );
};

export default ThumbsUpButton;
