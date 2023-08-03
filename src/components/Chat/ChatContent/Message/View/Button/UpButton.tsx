import React from 'react';

import DownChevronArrow from '@icon/DownChevronArrow';

import BaseButton from './BaseButton';

const UpButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <BaseButton
      icon={<DownChevronArrow className='rotate-180' />}
      buttonProps={{ 'aria-label': 'shift message up' }}
      onClick={onClick}
    />
  );
};

export default UpButton;
