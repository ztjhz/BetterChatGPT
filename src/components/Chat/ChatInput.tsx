import React from 'react';
import RefreshIcon from '@icon/RefreshIcon';
import SendIcon from '@icon/SendIcon';

const ChatInput = () => {
  return (
    <div className='w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient'>
      <form className='stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6'>
        <div className='relative flex h-full flex-1 md:flex-col'>
          <TextField />
        </div>
      </form>
    </div>
  );
};

const TextField = () => {
  return (
    <div className='flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'>
      <textarea
        tabIndex={0}
        data-id='2557e994-6f98-4656-a955-7808084f8b8c'
        rows={1}
        className='m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0'
        style={{ maxHeight: '200px', height: '24px', overflowY: 'hidden' }}
      ></textarea>
      <button
        className='absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent'
        aria-label='submit'
      >
        <SendIcon />
      </button>
    </div>
  );
};

export default ChatInput;
