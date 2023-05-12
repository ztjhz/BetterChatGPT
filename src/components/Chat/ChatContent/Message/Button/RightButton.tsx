import React from 'react';

import DownChevronArrow from '@icon/DownChevronArrow';

import BaseButton from './BaseButton';

const RightButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <BaseButton
      icon={
        <DownChevronArrow
          className='rotate-[270deg] m-1'
        />
      }
      disabled={disabled}
      onClick={onClick}
    />
  );
};

export default RightButton;
