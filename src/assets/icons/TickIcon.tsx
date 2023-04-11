import React from 'react';

const TickIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      stroke='currentColor'
      fill='none'
      strokeWidth='2'
      viewBox='0 0 24 24'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-4 w-4'
      height='1em'
      width='1em'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <polyline points='20 6 9 17 4 12'></polyline>
    </svg>
  );
};

export default TickIcon;
