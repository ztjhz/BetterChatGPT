import React from 'react';

const ArrowBottom = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      className='h-4 w-4'
      width='1em'
      height='1em'
      {...props}
    >
      <path d='M140.16 332.16a40.96 40.96 0 0 0 0 58.24l343.04 338.56a40.96 40.96 0 0 0 58.24 0l342.4-338.56a40.96 40.96 0 1 0-58.24-58.24L512 640 197.76 332.16a40.96 40.96 0 0 0-57.6 0z'></path>
    </svg>
  );
};

export default ArrowBottom;
