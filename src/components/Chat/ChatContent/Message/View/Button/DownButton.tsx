import React from 'react';

import DownChevronArrow from '@icon/DownChevronArrow';

import BaseButton from '../../Button/BaseButton';

const DownButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return <BaseButton icon={<DownChevronArrow />} onClick={onClick} />;
};

export default DownButton;
