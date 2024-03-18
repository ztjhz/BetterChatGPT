import React, { useEffect, useState } from 'react';
import useStore from '@store/store';


const TokensToast = () => {
  const tokensToastInputTokens = useStore((state) => state.tokensToastInputTokens);
  const tokensToastCompletionTokens = useStore((state) => state.tokensToastCompletionTokens);
  
  //Toast must be shown at this moment (requested true)
  const tokensToastShow = useStore((state) => state.tokensToastShow);
  const setTokensToastShow = useStore((state) => state.setTokensToastShow);

  const [timeoutID, setTimeoutID] = useState<number>();

  //Settings toggle enables request toke    ns count showing (in general)
  const requestTokensCount = useStore((state) => state.requestTokensCount);

  const generating = useStore((state) => state.generating);

  useEffect(() => {
    if (tokensToastShow) {
      window.clearTimeout(timeoutID);

      const newTimeoutID = window.setTimeout(() => {
        setTokensToastShow(false);
      }, 3000);

      setTimeoutID(newTimeoutID);
    }
  }, [setTokensToastShow, tokensToastInputTokens, tokensToastCompletionTokens]);

  return (tokensToastShow && requestTokensCount) ? (
        <div className={`flex z-0 justify-start`}>
            <div className={`min-w-[12em] z-1000 text-gray-500 dark:text-gray-300 rounded-lg md:border border-gray-400/30 bg-neutral dark:bg-neutral-700`}>
                <div className='ml-3 mr-3 text-sm font-normal text-start dark:bg-neutral-700 bg-neutral'>
                    Input Tokens: {tokensToastInputTokens}<br/>
                    Completion Tokens: {tokensToastCompletionTokens}
                </div>
                {/* <button
                    type='button'
                    className='ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700'
                    aria-label='Close'
                    onClick={() => {
                        setTokensToastShow(false);
                    }}
                >
                    <CloseIcon />
                </button> */}
        </div>
    </div>
  ) : (
    <></>
  );
};

const CloseIcon = () => (
  <>
    <span className='sr-only'>Close</span>
    <svg
      aria-hidden='true'
      className='w-5 h-5'
      fill='currentColor'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
        clipRule='evenodd'
      ></path>
    </svg>
  </>
);

export default TokensToast;
