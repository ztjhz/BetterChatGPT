import React, { memo } from 'react';

import EditIcon2 from '@icon/EditIcon2';

import BaseButton from './BaseButton';

const EditButton = memo(
  ({
    setIsEdit,
  }: {
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <BaseButton
        icon={<EditIcon2 />}
        buttonProps={{ 'aria-label': 'edit message' }}
        onClick={() => setIsEdit(true)}
      />
    );
  }
);

export default EditButton;
