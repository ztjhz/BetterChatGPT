import React, { useState } from 'react';

import useStore from '@store/store';

import BaseButton from './BaseButton';

import MarkdownIcon from '@icon/MarkdownIcon';
import FileTextIcon from '@icon/FileTextIcon';

const MarkdownModeButton = () => {
  const markdownMode = useStore((state) => state.markdownMode);
  const setMarkdownMode = useStore((state) => state.setMarkdownMode);

  return (
    <BaseButton
      icon={markdownMode ? <MarkdownIcon /> : <FileTextIcon />}
      buttonProps={{ 'aria-label': 'toggle markdown mode' }}
      onClick={() => {
        setMarkdownMode(!markdownMode);
      }}
    />
  );
};

export default MarkdownModeButton;
