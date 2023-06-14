import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

export default ({value, setValue, handleSubmit}: any) => {
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
        className={`w-full flex items-center gap-2 rounded-md rounded-tl-none py-2 md:py-2 lg:py-4 px-4 pr-1 md:pr-1 md:px-4 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 relative`}
      >
        <div className="absolute left-0 -top-7 rounded-md rounded-b-none bg-violet-400 text-white text-sm p-2 py-1">{t('freetip')}</div>
    <textarea
          ref={textareaRef}
          className='m-0 resize-none bg-transparent overflow-y-hidden w-full placeholder:text-gray-500/40 text-sm'
          onChange={(e) => {
            setValue(e.target.value);
          }}
          autoFocus
          value={value}
          placeholder={t('mainSearchPlaceholder') as string}
          onKeyDown={handleKeyDown}
          rows={1}
    ></textarea>
    <div onClick={() => handleSubmit()}>
      <MagnifyingGlassIcon className="w-5 h-5 mr-1 text-gray-500" />
    </div>
  </div>
  )
}