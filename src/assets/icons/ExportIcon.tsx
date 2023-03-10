import React from 'react';

const ExportIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      viewBox='0 0 24 24'
      height='1em'
      width='1em'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' />
      <path d='M14 3v4a1 1 0 001 1h4' />
      <path d='M11.5 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v5m-5 6h7m-3-3l3 3-3 3' />
    </svg>
  );
};

export default ExportIcon;
