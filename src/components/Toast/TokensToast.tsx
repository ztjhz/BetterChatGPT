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
                <div className={`flex w-full z-1000 justify-start`}>
                      <div  className='bg-neutral-50 hover:bg-neutral-50 dark:bg-neutral-800 hover:dark:bg-neutral-800 
                          prose dark:prose-invert text-sm rounded-md 
                          relative min-w-[12em] z-1000 justify-center items-center border-0 md:border border-gray-900 dark:border-gray-200 
                            p-1 pl-2
                            text-'>
                              Input Tokens: {tokensToastInputTokens}<br/>
                              Generation Tokens: {tokensToastCompletionTokens}
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
