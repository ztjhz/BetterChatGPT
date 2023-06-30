import React from 'react';

import RefreshIcon from '@icon/RefreshIcon';

import BaseButton from './BaseButton';

const RefreshButton = ({
  onClick,
  spin,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  spin?: boolean;
}) => {
  return <BaseButton icon={<RefreshIcon />} additionalClasses={spin ? 'animate-spin' : ''} onClick={onClick} />;
};
export default RefreshButton;
