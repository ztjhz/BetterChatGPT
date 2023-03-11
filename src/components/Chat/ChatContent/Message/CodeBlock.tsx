import React, { useRef, useState } from 'react';

import CopyIcon from '@icon/CopyIcon';
import TickIcon from '@icon/TickIcon';

const CodeBlock = ({
  lang,
  codeChildren,
}: {
  lang: string;
  codeChildren: React.ReactNode & React.ReactNode[];
}) => {
  const codeRef = useRef<HTMLElement>(null);

  return (
    <div className='bg-black rounded-md'>
      <CodeBar lang={lang} codeRef={codeRef} />
      <div className='p-4 overflow-y-auto'>
        <code ref={codeRef} className={`!whitespace-pre hljs language-${lang}`}>
          {codeChildren}
        </code>
      </div>
    </div>
  );
};

const CodeBar = React.memo(
  ({
    lang,
    codeRef,
  }: {
    lang: string;
    codeRef: React.RefObject<HTMLElement>;
  }) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);
    return (
      <div className='flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans'>
        <span className=''>{lang}</span>
        <button
          className='flex ml-auto gap-2'
          onClick={async () => {
            const codeString = codeRef.current?.textContent;
            if (codeString)
              navigator.clipboard.writeText(codeString).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 3000);
              });
          }}
        >
          {isCopied ? (
            <>
              <TickIcon />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon />
              Copy code
            </>
          )}
        </button>
      </div>
    );
  }
);
export default CodeBlock;
