import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


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
      console.log(e.shiftKey, e.ctrlKey)
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
        className={`w-full flex items-start gap-2 rounded-md py-1 md:py-1 px-4 pr-1 md:pr-1 md:px-4 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700`}
      >
    <textarea
          ref={textareaRef}
          className='m-0 resize-none bg-transparent overflow-y-hidden w-full placeholder:text-gray-500/40 text-sm mt-2'
          onChange={(e) => {
            setValue(e.target.value);
          }}
          autoFocus
          value={value}
          placeholder={t('mainSearchPlaceholder') as string}
          onKeyDown={handleKeyDown}
          rows={1}
    ></textarea>
    <div className='flex shrink-0'>
      <div className='flex-1 text-center flex justify-center'>
        <button
            className={`btn rounded-md relative btn-primary`}
            onClick={handleSubmit}
          >
            <div className='flex items-center justify-center gap-2'>
              {t('askToFAQ')}
            </div>
          </button>
      </div>
    </div>
  </div>
  )
}