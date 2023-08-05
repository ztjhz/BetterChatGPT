import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';

export default ({ value, setValue, handleSubmit }: any) => {
  const textareaRef = React.createRef<HTMLTextAreaElement>();
  const { t } = useTranslation();

  const resetTextAreaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(
        navigator.userAgent
      );

    if (e.key === 'Enter' && !isMobile && !e.nativeEvent.isComposing) {
      if (e.shiftKey) {
        resetTextAreaHeight();
      } else {
        e.preventDefault();
        handleSubmit();
        resetTextAreaHeight();
      }
    }
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <div
      className={`flex w-full items-center gap-2 rounded-lg rounded-br-none rounded-bl-none border border-b-0 border-bg-200 py-4 px-4 pr-1 md:rounded-br-lg md:rounded-bl-lg md:border-b-2 md:py-2 md:px-6 md:pr-1 lg:py-4`}
    >
      <textarea
        ref={textareaRef}
        className='text-md m-0 w-full resize-none overflow-y-hidden bg-transparent text-white placeholder:text-bg-400'
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
        placeholder={t('mainSearchPlaceholder') as string}
        onKeyDown={handleKeyDown}
        rows={1}
        maxLength={150}
      ></textarea>
      <div onClick={() => handleSubmit()}>
        <MagnifyingGlassIcon className='mr-3 h-6 w-6 cursor-pointer text-primary md:mr-6' />
      </div>
    </div>
  );
};
