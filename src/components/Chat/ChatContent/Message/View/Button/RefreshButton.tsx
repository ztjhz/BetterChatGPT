import React from 'react';

import RefreshIcon from '@icon/RefreshIcon';

import BaseButton from './BaseButton';

const RefreshButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return <BaseButton icon={<RefreshIcon />} onClick={onClick} />;
};

export default RefreshButton;
