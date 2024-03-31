import React, { useEffect, useState } from 'react';
import useStore from '@store/store';


const TokensToast = () => {
  const tokensToastInputTokens = useStore((state) => state.tokensToastInputTokens);
  const tokensToastCompletionTokens = useStore((state) => state.tokensToastCompletionTokens);
  
  //Toast must be shown at this moment (requested true)
  const tokensToastShow = useStore((state) => state.tokensToastShow);
  const setTokensToastShow = useStore((state) => state.setTokensToastShow);

  const [timeoutID, setTimeoutID] = useState<number>();

  //Settings toggle enables request tokens count showing (in general)
  const requestTokensCount = useStore((state) => state.requestTokensCount);

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
                          relative min-w-[12em] justify-center items-center border-0 md:border border-gray-900 dark:border-gray-200 
                            p-1 pl-2'>
                              Input Tokens: {tokensToastInputTokens}<br/>
                              Generation Tokens: {tokensToastCompletionTokens}
                    </div>
                </div>
  ) : (
    <></>
  );
};

export default TokensToast;
