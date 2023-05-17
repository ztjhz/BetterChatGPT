import React, { memo } from 'react';

import DeleteIcon from '@icon/DeleteIcon';

import BaseButton from './BaseButton';

const DeleteButton = memo(
  ({
    setIsDelete,
  }: {
    setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <BaseButton icon={<DeleteIcon />} onClick={() => setIsDelete(true)} />
    );
  }
);

export default DeleteButton;
