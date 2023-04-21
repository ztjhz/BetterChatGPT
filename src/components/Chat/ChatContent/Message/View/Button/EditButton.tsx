import React, { memo } from 'react';

import EditIcon2 from '@icon/EditIcon2';

import BaseButton from './BaseButton';

const EditButton = memo(
  ({
    setIsEdit,
  }: {
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return <BaseButton icon={<EditIcon2 />} onClick={() => setIsEdit(true)} />;
  }
);

export default EditButton;
