import React, { memo } from 'react';

import LikeIcon from '@icon/LikeIcon';

import BaseButton from './BaseButton';

const LikeButton = memo(
  () => {
    return (
      <BaseButton
        icon={<LikeIcon />}
        buttonProps={{ 'aria-label': 'like', 'title': 'Not Implemented' }}

        onClick={() => {}}  //Nothing for now. Not implemented.
      />
    );
  }
);

export default LikeButton;
