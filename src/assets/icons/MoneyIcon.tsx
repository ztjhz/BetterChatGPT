import React from 'react';

const MoneyIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm5.5 11v2H11v2h2v-2h1a2.5 2.5 0 100-5h-4a.5.5 0 110-1h5.5V8H13V6h-2v2h-1a2.5 2.5 0 000 5h4a.5.5 0 110 1H8.5z' />
    </svg>
  );
};

export default MoneyIcon;
